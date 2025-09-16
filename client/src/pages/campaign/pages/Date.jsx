import Directions from "src/pages/campaign/components/Directions";
import DateForm from "src/pages/campaign/components/DateForm";
import Footer from "src/pages/campaign/components/Footer";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";
import useManageCampaignStore from "src/pages/campaign/store";
import React, { useState, useEffect, useContext } from "react";

import "src/assets/css/CampaignForm.css";
import { DATE_STEP, DATE_DESCRIPTION } from "src/utils/Constants";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const DraftDate = () => {
  const { fetchDraft } = useManageCampaignStore();

  useEffect(() => {
    fetchDraft();
  }, []);
  const { closeoutDate, isLoading } = useManageCampaign();

  const isButtonDisabled = !closeoutDate || isLoading;

  const links = {
    prevLink: "/draft/image",
    nextLink: "/draft/review",
  };
  return (
    <div className="flex col w-full h-screen bg-[#f5f5f5]">
      <Directions step={DATE_STEP} descriptionText={DATE_DESCRIPTION} />
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="flex sm:px-5 md:px-20 lg:px-35 pt-46 items-center justify-center">
          <DateForm />
        </div>
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
