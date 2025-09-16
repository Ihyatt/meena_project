import React, { useContext } from "react";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";
import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const ContinueButton = ({ children }) => {
  const { handleShare } = useContext(CampaignContext);
  const handlClick = (event) => {
    event.preventDefault();
    handleShare();
  };
  return (
    <div
      onClick={handlClick}
      className="
                font - medium 
                text-base
            flex-1
            px-7 py-4
            border-none
            rounded
            rounded-full
           cursor-pointer
                text-white bg-[#0fa347] hover:bg-[#2bbd62] 
    "
    >
      {children}
    </div>
  );
};
export default ContinueButton;
