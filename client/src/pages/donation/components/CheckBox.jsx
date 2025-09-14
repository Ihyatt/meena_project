export const CheckBox = ({ checked, handleCheckboxChange, message }) => {
  return (
    <div className="inline-flex items-center text-sm mr-1 text-gray-400 font-light">
      <label className="flex items-center cursor-pointer relative mr-2">
        <input
          checked={checked}
          onChange={handleCheckboxChange}
          type="checkbox"
          className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
        />
        <span
          className="
                    absolute
                    text-white
                    opacity-0
                    peer-checked:opacity-100
                    top-1/2
                    left-1/2
                    transform
                    -translate-x-1/2
                    -translate-y-1/2
                  "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      </label>
      <label>{message}</label>
    </div>
  );
};
export default CheckBox;
