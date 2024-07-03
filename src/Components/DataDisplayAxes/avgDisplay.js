import React from "react";

const avgDisplay = ({ totalSum }) => {
  const data = totalSum.getSum;
  // console.log(totalSum);
  // console.log("sc", field1);
  return (
    <div className="chart-body">
      {data !== null && <h1> Total Avg: {data}</h1>}
    </div>
  );
};

export default avgDisplay;
