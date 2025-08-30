import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ allTimeDonationRetentionData }) => {
  if (
    !allTimeDonationRetentionData ||
    !allTimeDonationRetentionData.new ||
    !allTimeDonationRetentionData.repeat
  ) {
    return <div>Loading chart data...</div>;
  }

  const data = {
    labels: ["New Donations", "Retentioned Donations"],
    datasets: [
      {
        label: "$",
        data: [
          allTimeDonationRetentionData.new.amount,
          allTimeDonationRetentionData.repeat.amount,
        ],
        backgroundColor: ["#edafb0", "#2bbd62"],
        borderColor: ["white"],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};
export default PieChart;
