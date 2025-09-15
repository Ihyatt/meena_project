const CoverImage = ({ imageUrl }) => {
  return (
    <div className="pb-5">
      <img
        src={imageUrl}
        alt="ui/ux review check"
        className="rounded-lg shadow-md h-100 w-full object-cover"
      />
    </div>
  );
};
export default CoverImage;
