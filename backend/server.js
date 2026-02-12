
const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "admin",
  host: "postgres",
  database: "lowcode",
  password: "admin",
  port: 5432
});

app.post("/api/ai/generate", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await axios.post("http://ollama:11434/api/generate", {
    model: "qwen2.5-coder:7b-q4_K_M",
    prompt: `Return STRICT JSON with layout and widgets for dashboard: ${prompt}`,
    stream: false
  });
  res.json(JSON.parse(response.data.response));
});

app.post("/api/projects/save", async (req, res) => {
  const version = uuidv4();
  await pool.query("CREATE TABLE IF NOT EXISTS project_versions (id text, data jsonb)");
  await pool.query("INSERT INTO project_versions VALUES ($1, $2)", [version, req.body]);
  res.json({ version });
});

app.post("/api/export", async (req, res) => {
  const exportId = uuidv4();
  const exportPath = path.join(__dirname, "exports", exportId);
  fs.mkdirSync(exportPath, { recursive: true });
  fs.writeFileSync(path.join(exportPath, "dashboard.json"), JSON.stringify(req.body, null, 2));

  const zipPath = path.join(__dirname, "exports", exportId + ".zip");
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip");
  archive.pipe(output);
  archive.directory(exportPath, false);
  archive.finalize();

  res.json({ download: "/exports/" + exportId + ".zip" });
});

app.use("/exports", express.static(path.join(__dirname, "exports")));

app.listen(5000, () => console.log("Backend running"));
