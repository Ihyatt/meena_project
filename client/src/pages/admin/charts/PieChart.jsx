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

  return (
    <div className="w-1/2  mr-2 rounded-lg shadow-md bg-white flex items-center justify-center p-8">
      {allTimeDonationRetentionData.new.amount == 0 &&
      allTimeDonationRetentionData.repeat.amount == 0 ? (
        <p>No data found for the current year</p>
      ) : (
        <Pie data={data} />
      )}
    </div>
  );
};
export default PieChart;
