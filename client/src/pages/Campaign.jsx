import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import './styles/Campaign.css'; // Import the CSS file
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


import  useCampaignStore  from '../stores/Campaign'
import  {useDonorStore} from '../stores/Donor'
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
  console.log("toggleEmailOptIn:", toggleEmailOptIn); 
  
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
   
  </div>
);
};

export default Campaign;