const CoverImage = ({ imageUrl }) => {
  console.log("HHERERE");
  console.log(imageUrl);
  return (
    <>
      <img
        src={imageUrl}
        alt="ui/ux review check"
        className="rounded-lg shadow-md h-100 w-full object-cover"
      />
    </>
  );
};
export default CoverImage;
