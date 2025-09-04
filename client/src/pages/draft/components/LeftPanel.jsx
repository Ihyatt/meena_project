const LeftPanel = ({ step, text }) => {
  return (
    <div className="pt-45 px-10 md:px-20 lg:px-20">
      <div className=" font-normal text-md pb-4  mb-4 border-b-2 border-[#0fa347] transition-colors duration-300">
        {" "}
        {step} of 6
      </div>

      <div className=" font-light text-5xl">{text}</div>
    </div>
  );
};
export default LeftPanel;
