import { DEFAULT_TITLE } from "src/utils/constants";

const CampaignTitle = ({ title }) => {
  return (
    <div className=" ">
      <div className=" text-5xl font-bold ">{title || DEFAULT_TITLE}</div>
    </div>
  );
};
export default CampaignTitle;
