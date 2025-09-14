import defaultImg from "src/assets/images/defaultImg.jpg";

const CoverImage = ({ imageUrl }) => {
  console.log("HHERERE");
  console.log(imageUrl);
  return (
    <>
      <img
        src={imageUrl || defaultImg}
        alt="ui/ux review check"
        className="rounded-lg shadow-md h-100 w-full object-cover"
      />
    </>
  );
};
export default CoverImage;
