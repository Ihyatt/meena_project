import { parse, format } from 'date-fns';

const BarChartParser = (rawData) => {
    const onetime = rawData?.onetime || [];
    const recurring = rawData?.recurring || [];


    const dataset = [];
    const monthYearData = new Map()

    for (const dataSet of onetime) {
        const date = parse(dataSet.created_at, 'EEE, dd MMM yyyy HH:mm:ss \'GMT\'', new Date());
        const month = format(date, 'MMM'); // "Feb"
        const year = format(date, 'yyyy'); // "2025"

        const monthYear = `${month} ${year}`
        if (!monthYearData.has(monthYear)) {
            monthYearData.set(monthYear, { month, year, onetime: 0, recurring: 0 });
        }
        monthYearData.get(monthYear).onetime += Number(dataSet.amount);
        monthYearData.get(monthYear).onetime = Math.round(monthYearData.get(monthYear).onetime * 100) / 100; // Round to 2 decimal places
    }

    for (const dataSet of recurring) {
        const date = parse(dataSet.created_at, 'EEE, dd MMM yyyy HH:mm:ss \'GMT\'', new Date());
        const month = format(date, 'MMM'); // "Feb"
        const year = format(date, 'yyyy'); // "2025"

        const monthYear = `${month} ${year}`
        if (!monthYearData.has(monthYear)) {
            monthYearData.set(monthYear, { month, year, onetime: 0, recurring: 0 });
        }
        monthYearData.get(monthYear).recurring += Number(dataSet.amount);
        monthYearData.get(monthYear).recurring = Math.round(monthYearData.get(monthYear).recurring * 100) / 100; // Round to 2 decimal places
    }

    for (const [monthYear, data] of monthYearData) {
        dataset.push({ ...data });
    }

    return dataset;
}

export default BarChartParser;
