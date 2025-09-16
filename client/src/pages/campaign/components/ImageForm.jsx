import ImageUpload from "src/components/ImageUpload";
import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const ImageForm = () => {
  const { campaignId, imageUrl, uploadFile } = useManageCampaign();
  console.log(campaignId, imageUrl);
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
