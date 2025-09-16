import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const DateForm = () => {
  const { closeoutDate, setCloseoutDate } = useManageCampaign();

  return (
    <div className="flex sm:px-5 md:px-20 lg:px-35 pt-46 items-center justify-center">
      <DatePicker
        selected={closeoutDate}
        onChange={(date) => setCloseoutDate(date)}
        className="w-full max-w-md text-lg font-semibold h-14 bg-transparent hover:bg-[#fafafa] placeholder:text-slate-400 text-slate-700 border border-[#b7b7b6] rounded-lg px-3 py-2 transition duration-300 focus:outline-none focus-within:border-[#232323] focus-within:border-2"
      />
    </div>
  );
};
export default DateForm;
