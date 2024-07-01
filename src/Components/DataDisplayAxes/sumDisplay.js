import React, { useState } from "react";

const SumDisplay = ({ dimensions }) => {
  const [selectedDimension, setSelectedDimension] = useState("");
  const [sumResult, setSumResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCountcard = async (dimension) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/getSum?chartSource=customers&field1=${dimensions}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const res = await response.json();
      setSumResult(res.data.totalSum);
      console.log(res.data.totalSum);
      setError(null);
    } catch (err) {
      console.error("Error fetching sum:", err);
      setError("Error fetching sum");
      setSumResult(null);
    }
  };

  return (
    <div>
      <label>Sum</label>
      <select
        className="select-class"
        value={selectedDimension}
        onChange={(e) => setSelectedDimension(e.target.value)}
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
      <button onClick={handleCountcard}>generate</button>
      <div className="chart-body">
        {sumResult !== null && <p>Total Sum: {sumResult}</p>}
      </div>

      {error && <p>{error}</p>}
    </div>
  );
};

export default SumDisplay;
