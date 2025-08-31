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
          tooltipFormat: "MMM d, h:mm a",
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
          text: "Time of Day",
        },
        ticks: {
          display: false, // ✅ Hides the numbers
        },
        grid: {
          drawTicks: false, // ✅ Prevents tick marks on the grid
        },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const amount = context.raw.r; // ✅ FIXED
            const date = new Date(context.parsed.x);
            const formattedDate = format(date, "MMM d, h:mm a");
            return [`Date: ${formattedDate}`, `$${amount * 10}`];
          },
        },
      },
      legend: {
        display: true,
      },
    },
  };

  // Function to get milliseconds since midnight
  const getMillisecondsOfDay = (date) => {
    const d = new Date(date);
    return (
      d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000
    );
  };

  const data = {
    datasets: [
      {
        label: "New Donations",
        data: currYearIndividualDonationRetentionData?.new.map((item) => ({
          x: new Date(item.date),
          y: getMillisecondsOfDay(item.date), // ✅ Time of day for y-axis
          r: parseFloat(item.amount) / 10, // ✅ Amount for bubble radius
        })),
        backgroundColor: "rgb(237, 175, 176, 0.5)",
      },
      {
        label: "Rentioned Donations",
        data: currYearIndividualDonationRetentionData?.repeat.map((item) => ({
          x: new Date(item.date),
          y: getMillisecondsOfDay(item.date), // ✅ Time of day for y-axis
          r: parseFloat(item.amount) / 10, // ✅ Amount for bubble radius
        })),
        backgroundColor: "rgba(43, 189, 98, 0.5)",
      },
    ],
  };
  return <Bubble options={options} data={data} />;
};

export default ScatterChart;
