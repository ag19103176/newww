import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels
);

const LineChart = ({ data }) => {
  if (
    !data ||
    !data.json_data ||
    !data.chartElements ||
    !data.chartElements.barLineChart
  ) {
    // Return a placeholder or handle the case where data is missing
    return <div>No data available</div>;
  }
  const labels = data.json_data.map((d) => d.label);
  const values = data.json_data.map((d) => d.value);
  const goal = data.chartElements.barLineChart.goalValue;
  const labelText = data.chartElements.barLineChart.goalLabel;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Dataset",
        data: values,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
      annotation: {
        annotations: {
          goalLine: {
            type: "line",
            mode: "horizontal",
            scaleID: "y",
            value: goal,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: `${labelText}: ${goal}`,
              enabled: true,
              position: "end",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              yAdjust: -10,
            },
          },
        },
      },
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
        formatter: (value, context) => {
          if (data.chartElements.barLineChart.valueToShow === "All") {
            return value;
          } else if (data.chartElements.barLineChart.valueToShow === "Some") {
            return context.dataIndex % 2 === 0 ? value : "";
          }
          return "";
        },
      },
    },
    scales: {
      x: {
        title: {
          display: data.chartElements.barLineChart.showLabel,
          text: data.field1,
        },
        ticks: {
          display: true, // Adjust as needed
        },
      },
      y: {
        title: {
          display: data.chartElements.barLineChart.yShowLabel,
          text: data.field2,
        },
        ticks: {
          display: true, // Adjust as needed
        },
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
