import { subMonths, startOfMonth, format } from 'date-fns';

const MonthsWindow = ({ numMonths = 6 }) => {
    const today = new Date();
    const resultDates = [];

    const startOfCurrentMonth = startOfMonth(today);

    for (let i = numMonths - 1; i >= 0; i--) {



        const targetMonth = subMonths(startOfCurrentMonth, i);
        const formattedMonthYear = format(targetMonth, 'MMMM yyyy');



        resultDates.push(targetMonth);
    }
    return resultDates;
}
export default MonthsWindow;
