import React from "react";

const SumDisplay = ({ totalSum }) => {
  const data = totalSum.getSum;
  // console.log("sc", field1);
  // console.log(totalSum);
  return (
    <div className="chart-body">
      {data !== null && <h1>Total Sum: {data}</h1>}
    </div>
  );
};

export default SumDisplay;
