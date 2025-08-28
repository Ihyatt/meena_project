import * as React from "react";

import { BarChart } from "@mui/x-charts/BarChart";
import useAdminStore from "src/pages/admin/store";
import BarChartParser from "src/pages/admin/utils/BarChartParser";
import { format } from "date-fns"; // Or any date formatting library

const DonationsBarChart = ({ window }) => {
  const dataset = BarChartParser(window);
  dataset.reverse(); // Reverse the dataset to show the most recent month first

  function valueFormatter(value) {
    return `$${value}`;
  }
  const transformedDataset = dataset.map((item) => ({
    ...item,
    monthYear: `${item.month} ${item.year}`, // or use a date formatter for better formatting
  }));

  return (
    <div>
      {window.onetime && window.onetime.length === 0 ? (
        <div className=" text-center text-gray-500 p-4 ">
          No donations available for the selected period.
        </div>
      ) : (
        <BarChart
          dataset={transformedDataset}
          xAxis={[{ dataKey: "monthYear" }]}
          series={[{ dataKey: "onetime", label: "one-time", valueFormatter }]}
          colors={["green", "red"]}
          slotProps={{
            legend: { hidden: true }, // 👈 Hides the legend
          }}
          height={500}
        />
      )}
    </div>
  );
};

export default DonationsBarChart;
