import Directions from "src/pages/campaign/components/Directions";
import GoalForm from "src/pages/campaign/components/GoalForm";
import Footer from "src/pages/campaign/components/Footer";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";

import "src/assets/css/CampaignForm.css";
import {
  DATE_STEP,
  DATE_DESCRIPTION,
  DATE_MIN,
  DATE_MAX,
} from "src/utils/Constants";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const DraftDate = () => {
  const isButtonDisabled = !closeoutDate || isLoading; //add date validation

  const links = {
    prevLink: "/draft/campaign-image",
    nextLink: "/draft/review",
  };
  return (
    <div className="flex col w-full h-screen bg-[#f5f5f5]">
      <Directions step={DATE_STEP} descriptionText={DATE_DESCRIPTION} />
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <GoalForm />
        <CampaignContext.Provider value={links}>
          <Footer
            progressStep={DATE_STEP}
            isButtonDisabled={isButtonDisabled}
          />
        </CampaignContext.Provider>
      </div>
    </div>
  );
};
export default DraftDate;
