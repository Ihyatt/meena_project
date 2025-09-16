export const SubSection = ({ sectionText, section, openModal }) => {
  return (
    <>
      <div className="flex justify-between py-6">
        <div>
          <div className="font-semibold">{sectionText}</div>
          <div className="my-3">{section}</div>
        </div>
        <div>
          <div
            onClick={openModal}
            className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3] px-4 py-1 rounded-full cursor-pointer text-sm"
          >
            edit
          </div>
        </div>
      </div>
      <div className="border-b border-[#f5f1ed]" />
    </>
  );
};
export default SubSection;
