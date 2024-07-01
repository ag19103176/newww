import React from "react";
import { Gauge } from "@mui/x-charts/Gauge";
import "./toggle.css";

const GaugeChartCard = ({ data }) => {
  // Assuming the data is in the format { value: 50, label: 'Some Label' }
  const parsedData = JSON.parse(data);

  const gaugeValue = parsedData.value;

  return (
    <div>
      <div className="chart-body">
        <Gauge
          value={gaugeValue}
          startAngle={-110}
          endAngle={110}
          sx={{
            [`& .MuiTypography-root`]: {
              fontSize: 19,
              transform: "translate(0px, 0px)",
            },
          }}
          text={({ value, valueMax }) => `${value} / ${valueMax}`}
        />
      </div>
    </div>
  );
};

export default GaugeChartCard;
