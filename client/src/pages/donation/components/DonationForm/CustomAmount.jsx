const CustomAmount = ({ amount, setAmount, blockInvalidChar }) => {
  return (
    <div className=" border border-gray-400  py-2 px-4 h-15 rounded-lg  flex items-center justify-between mb-3">
      <div className="flex flex-col text-xs items-center">
        <div className="text-sm">$</div>
        <div className="text-sm">USD</div>
      </div>
      <div className="text-2xl">
        <input
          type="number"
          pattern="[0-9]"
          title="only numbers"
          value={amount}
          onChange={setAmount}
          onKeyDown={blockInvalidChar}
          className="border-none rounded-lg focus:outline-none text-right"
        />
        {amount && <span>.00</span>}
      </div>
    </div>
  );
};
export default CustomAmount;
