import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ trackActiveCammpaignDonations }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Active Campaign",
      },
    },
  };

  const labels = Array.from({ length: 52 }, (_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Donations Raised By Week",
        data: labels.map((label) => {
          if (label in trackActiveCammpaignDonations) {
            return parseFloat(trackActiveCammpaignDonations[label].raised);
          }
          return 0;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className="w-1/2  ml-2 rounded-lg shadow-md bg-white flex items-center justify-center pt-8 px-8 pb-14">
      {Object.keys(trackActiveCammpaignDonations).length == 0 ? (
        <p>No data found for the current year</p>
      ) : (
        <Line options={options} data={data} />
      )}
    </div>
  );
};
export default LineChart;
