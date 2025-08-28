import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { format } from "date-fns";
import React from "react";
import { startOfMonth, subMonths, addMonths } from "date-fns";

const getSixMonthWindow = () => {
  const today = new Date();
  const end = startOfMonth(addMonths(today, 1));
  const start = subMonths(end, 6);
  return { start, end };
};

const DonationsScatterChart = ({ window }) => {
  const { start, end } = getSixMonthWindow();

  const series = [
    {
      label: "one-time",
      data: window.onetime
        ? window.onetime.map((data) => ({
            x: new Date(data.created_at),
            y: data.amount,
          }))
        : [],
      highlightScope: { highlight: "item", fade: "global" },
    },
  ];

  const xAxisConfig = [
    {
      scaleType: "time",
      min: start,
      max: end,
      tickMinStep: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds for a monthly tick
      valueFormatter: (date) => {
        if (date instanceof Date) {
          return format(date, "MMM yyyy");
        }
        return String(date);
      },
    },
  ];

  const yAxisConfig = [
    {
      valueFormatter: (amount) => {
        if (typeof amount === "number") {
          return `$${amount.toLocaleString()}`;
        }
        return String(amount);
      },
    },
  ];

  return (
    <div>
      {window.onetime && window.onetime.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No donations available for the selected period.
        </div>
      ) : (
        <ScatterChart
          height={500}
          colors={["green", "red"]}
          voronoiMaxRadius={30}
          series={series}
          disableAxisListener={false}
          axisTick={"line"}
          axisTickLabel
          xAxis={xAxisConfig}
          yAxis={yAxisConfig}
          slotProps={{
            legend: { hidden: true },
          }}
        />
      )}
    </div>
  );
};

export default DonationsScatterChart;
