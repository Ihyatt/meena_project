import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import './Campaign.css'; // Import the CSS file
import  useCampaignStore  from '../stores/Campaign'


const Campaign = () => {
  const { setCampaign } = useCampaignStore();
  const navigate = useNavigate();

  const campaign = useLoaderData();
  
  if (campaign.isLoading) {
    return <div>Loading...</div>;
  }

  if (campaign.isError) {
    return <div>Error loading posts.</div>;
  }
  useEffect(() => {
    console.log("Campaign page mounted");
    setCampaign(campaign.id)
  }, []);

  const handleDonateClick = () => {
    const { campaignId } = useCampaignStore();
    navigate(`/campaigns/${campaignId}/checkout`);
  };

  return (
    <div className="donation-page-container">
      <div className="donation-content">
        <h1 className="donation-title">{campaign.title}</h1>
        <p className="donation-subtitle">{campaign.description}</p>
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
