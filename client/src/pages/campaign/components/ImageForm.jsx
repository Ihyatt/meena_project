import ImageUpload from "src/components/ImageUpload";

const ImageForm = () => {
  return (
    <div className="sm:px-10 md:px-20 lg:px-30 pt-50 ">
      <ImageUpload
        campaignId={campaignId}
        imageUrl={imageUrl}
        uploadFile={uploadFile}
      />
    </div>
  );
};
export default ImageForm;
