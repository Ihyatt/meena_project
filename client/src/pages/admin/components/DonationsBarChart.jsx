import * as React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';
import useAdminStore from 'src/stores/Admin';
import BarChartParser from 'src/components/BarChartParser';
import { format } from 'date-fns'; // Or any date formatting library





const DonationsBarChart = () => {
    const { donationsWindow } = useAdminStore();
    const dataset = BarChartParser(donationsWindow);
    dataset.reverse(); // Reverse the dataset to show the most recent month first




    function valueFormatter(value) {
        return `$${value}`;
    }
    const transformedDataset = dataset.map(item => ({
        ...item,
        monthYear: `${item.month} ${item.year}` // or use a date formatter for better formatting
    }));

    return (
        <div className="rounded-lg shadow-sm">
            <BarChart
                dataset={transformedDataset}
                xAxis={[{ dataKey: 'monthYear' }]}
                series={[
                    { dataKey: 'onetime', label: 'one-time', valueFormatter },
                    { dataKey: 'recurring', label: 'recurring', valueFormatter },


                ]}
                colors={['green', 'red']}
                slotProps={{
                    legend: { hidden: true }, // 👈 Hides the legend
                }}
                height={300}
            />
        </div>
    );
}

export default DonationsBarChart;