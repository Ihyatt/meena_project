import useManageCampaignStore from "src/pages/campaign/store";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

const useCampaign = () => {
  const navigate = useNavigate();

  const {
    campaignId,
    fetchDraft,
    saveDraft,
    isLoading,
    title,
    setTitle,
    description,
    setDescription,
    goal,
    setGoal,
    closeoutDate,
    setCloseoutDate,
    imageUrl,
    setImageUrl,
    error,
    upload,
    shareDraft,
    saveCampaign,
  } = useManageCampaignStore();

  const handleSaveDraft = (nextDestination) => {
    saveDraft().then((success) => {
      if (success) {
        navigate(nextDestination);
      } else {
        console.error("Error saving draft");
      }
    });
  };
  const handleShareDraft = () => {
    shareDraft().then((success) => {
      if (success) {
        navigate("/admins/campaigns");
      } else {
        console.error("Error sharing draft");
      }
    });
  };

  const handleSaveCampaign = () => {
    saveCampaign().then((success) => {
      if (success) {
        navigate("/admins/campaigns");
      } else {
        console.error("Error saving campaign");
      }
    });
  };

  const uploadFile = (file) => {
    upload(campaignId, file).then((data) => {
      setImageUrl(data.url);
    });
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    goal,
    setGoal,
    closeoutDate,
    setCloseoutDate,
    imageUrl,
    setImageUrl,
    error,
    upload,
    isLoading,
    handleSaveDraft,
    saveCampaign,
    shareDraft,
    uploadFile,
    campaignId,
    handleShareDraft,
    saveDraft,
    handleSaveCampaign,
  };
};

export default useCampaign;
