const Progressbar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1 relative">
      <div
        className="bg-[#0fa347] h-1 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
export default Progressbar;
