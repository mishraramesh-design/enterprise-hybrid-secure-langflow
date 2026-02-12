import React from "react";
import GridLayout from "react-grid-layout";

export default function DashboardRenderer({ layout, widgets }) {
  return (
    <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
      {widgets.map((widget) => (
        <div key={widget.id} data-grid={widget.position}>
          {widget.type === "kpi" && <div><h3>{widget.title}</h3><p>{widget.value || "KPI"}</p></div>}
          {widget.type === "chart" && <div><h3>{widget.title}</h3><p>Chart Placeholder</p></div>}
          {widget.type === "table" && <div><h3>{widget.title}</h3><p>Table Placeholder</p></div>}
        </div>
      ))}
    </GridLayout>
  );
}
