import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import './styles/Campaign.css'; // Import the CSS file
import  useCampaignStore  from '../stores/Campaign'


const Campaign = () => {
  const { setCampaign, campaignId } = useCampaignStore();
  const loadedCampaignData = useLoaderData();
  
  useEffect(() => {
    setCampaign(loadedCampaignData.id)
  }, [loadedCampaignData.id, setCampaign]);

  const navigate = useNavigate();

  if (loadedCampaignData.isLoading) {
    return <div>Loading...</div>;
  }

  if (loadedCampaignData.isError) {
    return <div>Error loading posts.</div>;
  }

  const handleDonateClick = () => {
    
    navigate(`/campaigns/${campaignId}/checkout`);
  };

  return (
    <div className="donation-page-container">
      <div className="donation-content">
        <h1 className="donation-title">{loadedCampaignData.title}</h1>
        <p className="donation-subtitle">{loadedCampaignData.description}</p>
        <button 
          onClick={handleDonateClick}
          className="donate-button"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default Campaign;
