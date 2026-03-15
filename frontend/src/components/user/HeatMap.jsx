import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import "./HeatMap.css";

const generateActivityData = (startDate, endDate) => {
  const data = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    data.push({
      date: current.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 50),
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
};

// Brand-themed panel colors: sage → teal → teal-dark
// level 0 = empty cell, levels 1–4 = intensity ramp
const PANEL_COLORS = {
  0: "#e8f0ee", // empty — soft sage-white
  1: "#BED4CB", // sage  — low activity
  2: "#87B6BC", // teal  — medium
  3: "#5e9199", // teal-dark — high
  4: "#3a6e75", // deep teal — very high
};

// Map raw count → level 0–4
const countToLevel = (count, max) => {
  if (!count || count === 0) return 0;
  const ratio = count / max;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState(PANEL_COLORS);
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));

  useEffect(() => {
    // Use the past 12 months from today
    const end = new Date();
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);

    const data = generateActivityData(
      start.toISOString().split("T")[0],
      end.toISOString().split("T")[0],
    );

    const max = Math.max(...data.map((d) => d.count));
    const total = data.reduce((sum, d) => sum + d.count, 0);

    // Build level-keyed colors using the same thresholds
    const colors = {};
    data.forEach((d) => {
      const level = countToLevel(d.count, max);
      colors[d.count] = PANEL_COLORS[level];
    });
    // Always ensure 0 is mapped
    colors[0] = PANEL_COLORS[0];

    setActivityData(data);
    setPanelColors(colors);
    setTotalCount(total);
    setStartDate(start);
  }, []);

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-header">
        <h4 className="heatmap-title">Contribution Activity</h4>
        <span className="heatmap-total">
          {totalCount.toLocaleString()} contributions this year
        </span>
      </div>

      <div className="heatmap-scroll">
        <HeatMap
          className="HeatMapProfile"
          value={activityData}
          weekLabels={WEEK_LABELS}
          startDate={startDate}
          rectSize={13}
          space={3}
          rectProps={{ rx: 3 }}
          panelColors={panelColors}
          style={{
            color: "var(--text-muted, #8aada8)",
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            width: "100%",
          }}
        />
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        {Object.values(PANEL_COLORS).map((color, i) => (
          <span
            key={i}
            className="legend-cell"
            style={{ background: color }}
            title={["None", "Low", "Medium", "High", "Very high"][i]}
          />
        ))}
        <span className="legend-label">More</span>
      </div>
    </div>
  );
};

export default HeatMapProfile;
