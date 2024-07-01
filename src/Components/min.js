import React, { useState, useEffect } from "react";

const PieChartWithMinSlice = ({ initialSlices }) => {
  const [slices, setSlices] = useState(initialSlices);
  const [minPC, setMinPC] = useState(0.5); // Minimum percentage
  const [adjustedSlices, setAdjustedSlices] = useState([]);

  useEffect(() => {
    const total = slices.reduce((sum, value) => sum + value, 0);
    const minValue = (total * minPC) / 100;

    let newSlices = slices.map(value => Math.max(value, minValue));
    const adjustedTotal = newSlices.reduce((sum, value) => sum + value, 0);
    newSlices = newSlices.map(value => (value / adjustedTotal) * total);

    setAdjustedSlices(newSlices);
  }, [slices, minPC]);

  return (
    <div>
      <label>
        Min Slice Percentage:
        <input
          type="number"
          value={minPC}
          onChange={(e) => setMinPC(parseFloat(e.target.value))}
          step="0.1"
          min="0"
          max="100"
        />
      </label>

      <h2>Original Slices:</h2>
      <ul>
        {slices.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>

      <h2>Adjusted Slices:</h2>
      <ul>
        {adjustedSlices.map((value, index) => (
          <li key={index}>{value.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

export default PieChartWithMinSlice;

// <PieChartWithMinSlice initialSlices={[10, 20, 30, 5]} />
