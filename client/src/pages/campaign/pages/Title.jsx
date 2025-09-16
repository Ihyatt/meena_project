import Directions from "src/pages/campaign/components/Directions";
import TitleForm from "src/pages/campaign/components/TitleForm.jsx";
import Footer from "src/pages/campaign/components/Footer.jsx";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";

import "src/assets/css/CampaignForm.css";
import {
  TTILE_STEP,
  TITLE_DESCRIPTION,
  TITLE_CHARACTER_MIN,
  TITLE_CHARACTERS_MAX,
} from "src/utils/Constants";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const DraftTitle = () => {
  const { title, isLoading } = useManageCampaign();

  const isButtonDisabled =
    title.length < TITLE_CHARACTER_MIN ||
    title.length > TITLE_CHARACTERS_MAX ||
    isLoading;

  const links = {
    prevLink: "/admins/campaigns",
    nextLink: "/draft/description",
  };
  console.log(title);
  return (
    <div className="flex col w-full h-screen bg-[#f5f5f5]">
      <Directions step={TTILE_STEP} descriptionText={TITLE_DESCRIPTION} />
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <TitleForm />
        <CampaignContext.Provider value={links}>
          <Footer
            progressStep={TTILE_STEP}
            isButtonDisabled={isButtonDisabled}
          />
        </CampaignContext.Provider>
      </div>
    </div>
  );
};
export default DraftTitle;
