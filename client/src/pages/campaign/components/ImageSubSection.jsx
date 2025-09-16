const ImageSubSection = ({ sectionText, section, openModal }) => {
  return (
    <div>
      <div className="flex justify-between my-3">
        <div className="font-semibold">{sectionText}</div>
        <div>
          <div
            onClick={openModal}
            className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3] px-4 py-1 rounded-full cursor-pointer text-sm"
          >
            edit
          </div>
        </div>
      </div>
      <img
        src={section}
        alt="ui/ux review check"
        className="rounded-lg h-100 w-full object-cover py-3"
      />
    </div>
  );
};
export default ImageSubSection;
