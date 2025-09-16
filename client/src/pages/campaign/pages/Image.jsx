import Directions from "src/pages/campaign/components/Directions";
import GoalForm from "src/pages/campaign/components/GoalForm";
import Footer from "src/pages/campaign/components/Footer";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";

import "src/assets/css/CampaignForm.css";
import { IMAGE_STEP, IMAGE_DESCRIPTION } from "src/utils/Constants";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const DraftImage = () => {
  const isButtonDisabled = !imageUrl || isLoading;
  const links = {
    prevLink: "/draft/goal",
    nextLink: "/draft/date",
  };

  return (
    <div className="flex col w-full h-screen bg-[#f5f5f5]">
      <Directions step={IMAGE_STEP} descriptionText={IMAGE_DESCRIPTION} />
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <DescriptionForm />
        <CampaignContext.Provider value={links}>
          <Footer
            progressStep={IMAGE_STEP}
            isButtonDisabled={isButtonDisabled}
          />
        </CampaignContext.Provider>
      </div>
    </div>
  );
};
export default DraftImage;
