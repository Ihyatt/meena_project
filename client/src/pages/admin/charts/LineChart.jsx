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
  return <Line options={options} data={data} />;
};
export default LineChart;
