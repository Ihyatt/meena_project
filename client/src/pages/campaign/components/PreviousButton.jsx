import React, { useContext } from "react";
import { CampaignContext } from "src/pages/campaign/context/campaignContext";
import { Link } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";

const PreviousButton = () => {
  const { prevLink } = useContext(CampaignContext);
  return (
    <>
      <div>
        <Link to={prevLink} style={{ color: "black", fontSize: "15px" }}>
          <RiArrowLeftSLine size={40} />
        </Link>
      </div>
    </>
  );
};
export default PreviousButton;
