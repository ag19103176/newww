import React from "react";
import "./dataMode.css";

const DataMode = ({
  dimensions,
  measures,
  setDimen,
  setMea,
  handleDimensionChange,
  handleMeasureChange,
  type,
}) => {
  return (
    <div className="select-container">
      <div>
        <label>{type === "1" ? "Dimension" : "X-axis"}</label>

        <select
          className="select-class"
          value={setDimen}
          onChange={(e) => handleDimensionChange(e.target.value)}
        >
          <option value="" className="option" disabled>
            Select a field
          </option>
          {dimensions.map((dim, index) => (
            <option key={index} value={dim}>
              {dim}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>{type === "1" ? "Measure" : "Y-axis"}</label>

        <select
          className="form-control select-class"
          value={setMea}
          onChange={(e) => handleMeasureChange(e.target.value)}
        >
          <option value="" className="option" disabled>
            Select a field
          </option>
          {measures.map((measure, index) => (
            <option key={index} value={measure}>
              {measure}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataMode;
