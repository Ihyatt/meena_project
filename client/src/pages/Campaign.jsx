import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import './styles/Campaign.css'; // Import the CSS file
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


import  useCampaignStore  from '../stores/Campaign'
import  useDonorStore from '../stores/Donor'
import CURRENCY_CODE from '../utils/constants';



const Campaign = () => {
  const { fetchCampaign, campaign, loading } = useCampaignStore();
  const { 
    firstName,
    setFirstName, 
    setLastName,
    lastName, 
    setAmount,
    amount,
    email,
    setEmail,
    toggleEmailOptIn,
    emailOptIn,
    setCurrency,
    currency,
  } = useDonorStore();
  
  console.log("setAmount:", setAmount);   
  useEffect(() => {
    fetchCampaign()
  }, []);
  console.log(firstName)
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
  console.log(lastName)

  return (
    <div className="donation-page-container">
    <div className="donation-content">
      <h1 className="donation-title">{campaign.title}</h1>
      <p className="donation-subtitle">{campaign.description}</p>
      
      <form onSubmit={handleDonateClick} className="donation-form">
        <div className="form-group">
          <label htmlFor="amount">Donation Amount ($)</label>

          <p>Logged in: {emailOptIn ? "Yes" : "No"}</p>
          <button type="button" onClick={toggleEmailOptIn}>
            Toggle Login
          </button>

          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="5"
            max="5000"
            step="0.1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">first name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required={false}
          />
        </div>

        <div className="form-group">
        <label htmlFor="name">last name</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required={false}
        />
      </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Autocomplete
          value={currency}
          onChange={(event, newCurrency) => {
            setCurrency(newCurrency);
          }}
          options={CURRENCY_CODE}
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        />
        

        
        <button type="submit" className="donate-button">
          Donate Now
        </button>
      </form>
    </div>
  </div>
);
};

export default Campaign;
