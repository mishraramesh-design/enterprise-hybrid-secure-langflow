
import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DashboardRenderer from "./components/DashboardRenderer";

function App() {
  const [prompt, setPrompt] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const generate = async () => {
    const res = await axios.post("/api/ai/generate", { prompt });
    setDashboard(res.data);
  };

  const saveVersion = async () => {
    await axios.post("/api/projects/save", dashboard);
    alert("Version saved");
  };

  const exportApp = async () => {
    const res = await axios.post("/api/export", dashboard);
    window.location.href = res.data.download;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Enterprise Hybrid Low-Code Platform</h2>
      <textarea rows="3" cols="80" value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
      <br/>
      <button onClick={generate}>Generate</button>
      <button onClick={saveVersion}>Save Version</button>
      <button onClick={exportApp}>Export App</button>
      {dashboard && <DashboardRenderer layout={dashboard.layout} widgets={dashboard.widgets} />}
    </div>
  );
}

export default App;
