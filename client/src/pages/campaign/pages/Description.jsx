import Directions from "src/pages/campaign/components/Directions";
import DescriptionForm from "src/pages/campaign/components/DescriptionForm";
import Footer from "src/pages/campaign/components/Footer";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";
import useManageCampaignStore from "src/pages/campaign/store";
import React, { useState, useEffect, useContext } from "react";

import "src/assets/css/CampaignForm.css";
import {
  DESCRIPTION_STEP,
  DESCRIPTION_DESCRIPTION,
  DESCRIPTION_CHARACTER_MIN,
  DESCRIPTION_CHARACTER_MAX,
} from "src/utils/Constants";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const DraftDescription = () => {
  const { fetchDraft } = useManageCampaignStore();

  useEffect(() => {
    fetchDraft();
  }, []);
  const { description, isLoading } = useManageCampaign();

  const isButtonDisabled =
    description.length < DESCRIPTION_CHARACTER_MIN ||
    description.length > DESCRIPTION_CHARACTER_MAX ||
    isLoading;

  const links = {
    prevLink: "/draft/title",
    nextLink: "/draft/goal",
  };
  return (
    <div className="flex col w-full h-screen bg-[#f5f5f5]">
      <Directions
        step={DESCRIPTION_STEP}
        descriptionText={DESCRIPTION_DESCRIPTION}
      />
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="sm:px-5 md:px-20 lg:px-35 pt-52 ">
          <DescriptionForm />
        </div>
        <CampaignContext.Provider value={links}>
          <Footer
            progressStep={DESCRIPTION_STEP}
            isButtonDisabled={isButtonDisabled}
          />
        </CampaignContext.Provider>
      </div>
    </div>
  );
};
export default DraftDescription;
