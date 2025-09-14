const AmountButton = ({ activeButton, amount, buttonId, handleClick }) => {
  return (
    <>
      <button
        type="button"
        className={`
                font-medium 
                text-base 
                flex-1 
                p-2 
                border 
                border-[#cecfdb] 
                rounded-lg
                text-gray-800 
                cursor-pointer
              ${
                activeButton === buttonId
                  ? "bg-[#0fa347] text-white border-none hover:bg-[#2bbd62] transition-colors duration-300"
                  : ""
              }
            `}
        onClick={() => handleClick(buttonId, amount)}
      >
        ${amount}
      </button>
    </>
  );
};
export default AmountButton;
