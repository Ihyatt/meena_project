import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const GoalForm = () => {
  const { goal, setGoal } = useManageCampaign();

  const handleGoalAmount = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const amountValue = parseFloat(cleanedValue);
    setGoal(amountValue);
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  return (
    <>
      <form>
        <div className=" border border-gray-400  p-2 rounded-sm  flex items-center justify-between mb-3 min-w-75 text-lg font-semibold w-full h-14 bg-transparent hover:bg-[#fafafa] placeholder:text-slate-400 text-slate-700  border border-[#b7b7b6] rounded-lg px-3 py-2 transition duration-300  focus:outline-none focus-within:border-[#232323] focus-within:border-2 ">
          <div className="flex flex-col text-xs items-center">
            <div>$</div>
            <div>USD</div>
          </div>
          <div className="text-2xl">
            <input
              type="number"
              pattern="[0-9]"
              title="only numbers"
              value={goal}
              onChange={handleGoalAmount}
              onKeyDown={blockInvalidChar}
              className="border-none rounded-sm focus:outline-none text-right"
            />
            {goal && <span className>.00</span>}
          </div>
        </div>
      </form>
    </>
  );
};
export default GoalForm;
