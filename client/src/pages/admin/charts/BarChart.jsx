import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ currYearByMonthDonationRetentionData }) => {
  if (!currYearByMonthDonationRetentionData) {
    return <div>Loading chart data...</div>;
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = {
    January: 1,
    February: 2,
    March: 3,

    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const data = {
    labels,
    datasets: [
      {
        label: "New Donations",
        data: labels.map((label) => {
          const monthNum = months[label];
          if (monthNum in currYearByMonthDonationRetentionData) {
            return currYearByMonthDonationRetentionData[monthNum].new;
          }
          return 0;
        }),
        backgroundColor: "#edafb0",
      },
      {
        label: "Retentioned Donations",
        data: labels.map((label) => {
          const monthNum = months[label];
          if (monthNum in currYearByMonthDonationRetentionData) {
            return currYearByMonthDonationRetentionData[monthNum].repeat;
          }
          return 0;
        }),
        backgroundColor: "#2bbd62",
      },
    ],
  };
  console.log(currYearByMonthDonationRetentionData.length);
  return (
    <div className="w-1/2 mr-2 rounded-lg shadow-md bg-white flex items-center justify-center p-8">
      {Object.keys(currYearByMonthDonationRetentionData).length == 0 ? (
        <p>No data found for the current year</p>
      ) : (
        <Bar options={options} data={data} />
      )}
    </div>
  );
};
export default BarChart;
