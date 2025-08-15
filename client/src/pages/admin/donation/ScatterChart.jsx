
import useAdminStore from 'src/pages/admin/store';
import MonthsWindow from 'src/pages/admin/utils/MonthsWindow';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { format } from 'date-fns'; // Or any date formatting library



const DonationsScatterChart = () => {
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
    ];


    const xAxisConfig = [
        {
            scaleType: 'time', // Important for Date objects
            data: MonthsWindow({ numMonths: 7 }), // Generates the last 7 months
            valueFormatter: (date, context) => {
                // This formatter applies to both axis ticks and tooltip header (if 'axis' type tooltip)
                if (date instanceof Date) {
                    return format(date, 'MMM yyyy'); // e.g., "Jan 2023"
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

        <div>
            {donationsWindow.onetime && donationsWindow.onetime.length === 0 ? (
                <div className=' text-center text-gray-500 p-4 '>
                    No donations available for the selected period.
                </div>
            ) : (
                <div className='rounded-lg shadow-sm '>
                    <ScatterChart
                        height={300}
                        colors={['green', 'red']}
                        voronoiMaxRadius={30}
                        series={series}
                        disableAxisListener={false}
                        axisTick={'line'}
                        axisTickLabel
                        xAxis={xAxisConfig}
                        yAxis={yAxisConfig}
                        slotProps={{
                            legend: { hidden: true }, // 👈 Hides the legend
                        }}
                    />
                </div>
            )}
        </div >


    );

}

export default DonationsScatterChart;