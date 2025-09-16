import ImageUpload from "src/components/ImageUpload";
import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const ImageForm = () => {
  const { campaignId, imageUrl, uploadFile } = useManageCampaign();
  console.log(campaignId, imageUrl);
  return (
    <>
      <ImageUpload
        campaignId={campaignId}
        imageUrl={imageUrl}
        uploadFile={uploadFile}
      />
    </>
  );
};
export default ImageForm;
