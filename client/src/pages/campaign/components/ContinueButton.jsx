import React, { useContext } from "react";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";
import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

const ContinueButton = ({ className, children }) => {
  const { nextLink } = useContext(CampaignContext);
  const { handleSave } = useManageCampaign();
  const handlClick = (event) => {
    event.preventDefault();
    handleSave(nextLink);
  };
  return (
    <div
      onClick={handlClick}
      className={`
                font - medium 
                text-base
            flex-1
            px-7 py-4
            border-none
            rounded
            rounded-full
            ${className}  
    `}
    >
      {children}
    </div>
  );
};
export default ContinueButton;
