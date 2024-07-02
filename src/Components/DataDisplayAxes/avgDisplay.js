import React from "react";

const avgDisplay = ({ totalSum }) => {
  const data = totalSum.getSum;
  console.log(totalSum);
  return (
    <div className="chart-body">
      {data !== null && <p>Total Avg: {data}</p>}
    </div>
  );
};

export default avgDisplay;
