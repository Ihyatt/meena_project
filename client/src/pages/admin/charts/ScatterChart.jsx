import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip, // Import Tooltip
  Legend, // Import Legend
  TimeScale,
} from "chart.js";
import { format } from "date-fns"; // ✅ Add this import statement
import "chartjs-adapter-date-fns";
import { Bubble } from "react-chartjs-2";

// ✅ Correctly register all necessary components and scales
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

const ScatterChart = ({ currYearIndividualDonationRetentionData }) => {
  console.log("scattercart", currYearIndividualDonationRetentionData);
  if (
    !currYearIndividualDonationRetentionData ||
    !currYearIndividualDonationRetentionData.new ||
    !currYearIndividualDonationRetentionData.repeat
  ) {
    return <div>Loading chart data...</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM d, h:mm a", // This format is used for the header
        },
        title: {
          display: true,
          text: "Date of Donation",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Donation Amount ($)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          // This callback is responsible for the label content
          label: function (context) {
            // Access the numerical y-value (amount)
            const amount = context.parsed.y;

            // Get the date object from the parsed x-value
            const date = new Date(context.parsed.x);

            // Format the date using date-fns
            const formattedDate = format(date, "MMM d, h:mm a");

            // Return an array of strings to display on separate lines
            return [`Date: ${formattedDate}`, `Amount: $${amount.toFixed(2)}`];
          },
        },
      },
      legend: {
        display: true,
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "First Time donation",
        data: currYearIndividualDonationRetentionData?.new.map((item) => ({
          x: new Date(item.date),
          y: parseFloat(item.amount),
          r: 10,
        })),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Repeat donation",
        data: currYearIndividualDonationRetentionData?.repeat.map((item) => ({
          x: new Date(item.date),
          y: parseFloat(item.amount),
          r: 10,
        })),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bubble options={options} data={data} />;
};

export default ScatterChart;
