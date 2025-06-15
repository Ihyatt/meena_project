// Campaign.jsx - No changes needed here, it's perfect as is with the CSS module import and classNames.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import './styles/Campaign.css'; // Import the CSS file (assuming it's Campaign.css, not Campaign.module.css)
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

  useEffect(() => {
    fetchCampaign()
  }, []);


  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  // // if (campaign.isError) {
  // //   return <div>Error loading posts.</div>;
  // // }

  const handleDonateClick = () => {
  
    navigate(`/campaigns/${campaign.id}/checkout`);
  };
  console.log(lastName)




  return (
    <div className="pageContainer">
      <div className="imageSection">
        <div className="image-overlay-text-container">
          <h2>{campaign.title}</h2>
          <p>{campaign.description}</p>
        </div>
      </div>

      <div className="formSection">
        <div className="formContentWrapper">
          <h3 className="heading">
              Meena Project
          </h3> 
          <form onSubmit={handleDonateClick}>
            <div>
              <label htmlFor="name" className="label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={firstName}
                onChange={setFirstName}
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={setEmail}
                required
                className="input"
              />
            </div>

            <button
              type="submit"
              className="button"
            >
              Donate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Campaign;