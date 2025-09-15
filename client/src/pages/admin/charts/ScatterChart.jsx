import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip, // Import Tooltip
  Legend, // Import Legend
  TimeScale,
} from "chart.js";
import { format } from "date-fns";
import "chartjs-adapter-date-fns";
import { Bubble } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

const ScatterChart = ({ currYearIndividualDonationRetentionData }) => {
  console.log(currYearIndividualDonationRetentionData);
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
          text: "Amount (in $)",
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
            const amount = context.raw.y; // ✅ FIXED
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

  const data = {
    datasets: [
      {
        label: "New Donations",
        data: currYearIndividualDonationRetentionData?.new.map((item) => ({
          x: new Date(item.date),
          y: parseInt(item.amount),
        })),
        backgroundColor: "rgb(237, 175, 176, 0.5)",
        pointRadius: 5,
      },
      {
        label: "Retained Donations",
        data: currYearIndividualDonationRetentionData?.repeat.map((item) => ({
          x: new Date(item.date),
          y: parseInt(item.amount),
        })),
        backgroundColor: "rgba(43, 189, 98, 0.5)",
        pointRadius: 5,
      },
    ],
  };

  return (
    <>
      {!currYearIndividualDonationRetentionData.new.length &&
      !currYearIndividualDonationRetentionData.repeat.length ? (
        <div className=" w-1/2 ml-2 rounded-lg shadow-md bg-white flex items-center justify-center p-8">
          No data found for the current year
        </div>
      ) : (
        <div className="w-1/2 ml-2 rounded-lg shadow-md bg-white">
          <Bubble options={options} data={data} />
        </div>
      )}
    </>
  );
};

export default ScatterChart;
