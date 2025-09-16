import Directions from "src/pages/campaign/components/Directions";
import GoalForm from "src/pages/campaign/components/GoalForm";
import Footer from "src/pages/campaign/components/Footer";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";

import "src/assets/css/CampaignForm.css";
import {
  GOAL_STEP,
  GOAL_DESCRIPTION,
  GOAL_MIN,
  GOAL_MAX,
} from "src/utils/Constants";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const DraftGoal = () => {
  const { goal, isLoading } = useManageCampaign();
  const isButtonDisabled =
    !goal || goal < GOAL_MIN || goal > GOAL_MAX || isLoading;

  const links = {
    prevLink: "/draft/description",
    nextLink: "/draft/image",
  };
  return (
    <div className="flex col w-full h-screen bg-[#f5f5f5]">
      <Directions step={GOAL_STEP} descriptionText={GOAL_DESCRIPTION} />
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <GoalForm />
        <CampaignContext.Provider value={links}>
          <Footer
            progressStep={GOAL_STEP}
            isButtonDisabled={isButtonDisabled}
          />
        </CampaignContext.Provider>
      </div>
    </div>
  );
};
export default DraftGoal;
