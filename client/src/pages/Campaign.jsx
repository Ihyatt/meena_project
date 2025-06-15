import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import './styles/Campaign.css'; // Import the CSS file
import  useCampaignStore  from '../stores/Campaign'


const Campaign = () => {
  const { fetchCampaign, campaign, loading } = useCampaignStore();
  
  useEffect(() => {
    fetchCampaign()
  }, []);

  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (campaign.isError) {
  //   return <div>Error loading posts.</div>;
  // }

  const handleDonateClick = () => {
    
    navigate(`/campaigns/${campaign.id}/checkout`);
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
