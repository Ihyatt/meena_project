
import useAdminStore from 'src/stores/Admin';
import MonthsWindow from 'src/components/MonthsWIndow';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { format } from 'date-fns'; // Or any date formatting library



const DonationsChart = () => {
    const { donationsWindow } = useAdminStore();
    const series = [
        {
            label: 'one-time',
            data: donationsWindow.onetime ? donationsWindow.onetime.map((data) => ({
                x: new Date(data.created_at),
                y: data.amount,
            })) : [],
            highlightScope: { highlight: 'item', fade: 'global' },
        },
        {
            label: 'recurring',
            data: donationsWindow.recurring ? donationsWindow.recurring.map((data) => ({
                x: new Date(data.created_at),
                y: data.amount,
            })) : [],
            highlightScope: { highlight: 'item', fade: 'global' },
        },
    ];


    const xAxisConfig = [
        {
            scaleType: 'time', // Important for Date objects
            data: MonthsWindow({ numMonths: 12 }), // Generates the last 12 months
            valueFormatter: (date, context) => {
                // This formatter applies to both axis ticks and tooltip header (if 'axis' type tooltip)
                if (date instanceof Date) {
                    return format(date, 'MMM dd, yyyy'); // e.g., "Jan 15, 2023"
                }
                return String(date); // Fallback for non-Date values
            },
        },
    ];

    // Axis configuration for Y (Amount)
    const yAxisConfig = [
        {
            valueFormatter: (amount, context) => {
                // This formatter applies to both axis ticks and tooltip series values
                if (typeof amount === 'number') {
                    return `$${amount.toLocaleString()}`; // e.g., "$100"
                }
                return String(amount);
            },
        },
    ];

    return (
        <ScatterChart
            height={300}
            colors={['orange', 'red']}
            voronoiMaxRadius={30}
            series={series}
            disableAxisListener={false}
            axisTick={'line'}
            axisTickLabel
            xAxis={xAxisConfig}
            yAxis={yAxisConfig}
        />
    );

}

export default DonationsChart;