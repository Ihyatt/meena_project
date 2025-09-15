import { DEFAULT_TITLE } from "src/utils/constants";

const CampaignTitle = ({ title }) => {
  return (
    <div className="text-5xl font-bold max-w-250 ">
      {title || DEFAULT_TITLE}
    </div>
  );
};
export default CampaignTitle;
