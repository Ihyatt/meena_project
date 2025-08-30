import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const DonutChart = ({ retentionData }) => {
  const data = [
    {
      label: "First Time",
      value: retentionData?.new?.amount,
      color: "#0fa347",
    },
    {
      label: "Repeat",
      value: retentionData?.repeat?.amount,
      color: "#DB5758",
    },
  ];

  const settings = {
    width: 600,
    height: 600,
    hideLegend: true,
  };

  return (
    <PieChart
      series={[
        {
          innerRadius: 30,
          outerRadius: 100,
          data,
          arcLabel: "value",
          arcLabelStyle: {
            fill: "#fff", // Makes the text white
            fontSize: 14,
            fontWeight: 600,
          },
        },
      ]}
      {...settings}
    />
  );
};

export default DonutChart;
