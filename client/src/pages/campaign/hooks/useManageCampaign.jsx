import useManageCampaignStore from "src/pages/campaign/store";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

const useCampaign = () => {
  const navigate = useNavigate();

  const titlecharactersLimit = 100;

  const {
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
    fetchCampaign,
    saveCampaign,
  } = useManageCampaignStore();

  useEffect(() => {
    fetchDraft();
  }, []);

  const handleSave = (event, nextDestination) => {
    event.preventDefault();
    saveDraft().then((success) => {
      if (success) {
        navigate(nextDestination);
      } else {
        console.error("Error saving draft");
      }
    });
  };

  const uploadFile = (file) => {
    upload(campaignId, file).then((data) => {
      setImageUrl(data.url);
      setFile(null);
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
    titlecharactersLimit,
    handleSave,
    fetchCampaign,
    saveCampaign,
    shareDraft,
    uploadFile,
  };
};

export default useCampaign;
