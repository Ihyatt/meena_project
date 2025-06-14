import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import './Campaign.css'; // Import the CSS file


const Campaign = () => {
  const campaign = useLoaderData();
  
  
  if (campaign.isLoading) {
    return <div>Loading...</div>;
  }

  if (campaign.isError) {
    return <div>Error loading posts.</div>;
  }


  const handleDonateClick = (campaignId) => {
    
    useNavigate(`/campaigns/${campaignId}/checkout`);
  };

  return (
    <div className="donation-page-container">
      <div className="donation-content">
        <h1 className="donation-title">{campaign.title}</h1>
        <p className="donation-subtitle">{campaign.description}</p>
        <button 
          onClick={handleDonateClick(campaign.id)}
          className="donate-button"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default Campaign;
