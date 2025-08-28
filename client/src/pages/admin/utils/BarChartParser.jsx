import { parse, format, subMonths } from "date-fns";

const BarChartParser = (rawData) => {
  const onetime = rawData?.onetime || [];

  // Create a base for the last 6 months, initializing all values to 0
  const monthYearData = new Map(
    generateLastSixMonths().map((item) => [item.monthYear, item])
  );

  // Populate data from raw API response
  for (const dataSet of onetime) {
    const date = parse(
      dataSet.created_at,
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
      new Date()
    );
    const monthYear = format(date, "MMM yyyy");

    // Only process data within the last six months
    if (monthYearData.has(monthYear)) {
      const data = monthYearData.get(monthYear);
      data.onetime += Number(dataSet.amount);
      data.onetime = Math.round(data.onetime * 100) / 100;
    }
  }

  // Convert the Map values back to an array
  const dataset = Array.from(monthYearData.values());

  return dataset;
};

// Moved the utility function inside the main file for clarity
const generateLastSixMonths = () => {
  const months = [];
  let currentDate = new Date();

  for (let i = 0; i < 6; i++) {
    months.unshift({
      month: format(currentDate, "MMM"),
      year: format(currentDate, "yyyy"),
      monthYear: format(currentDate, "MMM yyyy"),
      onetime: 0,
    });
    currentDate = subMonths(currentDate, 1);
  }
  return months;
};

export default BarChartParser;
