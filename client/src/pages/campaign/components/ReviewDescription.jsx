const ReviewDescription = ({ descriptionText }) => {
  return (
    <div className="hidden sm:block sm:w-1/2 md:w-2/5 lg:w-1/3 h-full">
      <div className="pt-45 px-10 md:px-20 lg:px-20">
        <div className="pb-4 mb-4 border-b-2 border-[#0fa347] transition-colors duration-300 font-light text-5xl">
          {descriptionText}
        </div>
      </div>
    </div>
  );
};
export default ReviewDescription;
