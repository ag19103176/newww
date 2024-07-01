// SumDisplay.js
import React from "react";

const SumDisplay = ({ sum }) => {
  return (
    <div className="sum-display">
      <h3>Total Sum:</h3>
      <p>{sum}</p>
    </div>
  );
};

export default SumDisplay;
