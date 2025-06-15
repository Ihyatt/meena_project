// Campaign.jsx - No changes needed here, it's perfect as is with the CSS module import and classNames.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap first
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015

import './styles/Campaign.css'; // Import the CSS file (assuming it's Campaign.css, not Campaign.module.css)
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AutoComplete } from 'primereact/autocomplete';


import  useCampaignStore  from '../stores/Campaign'
import  {useDonorStore} from '../stores/Donor'
import CURRENCY_CODE from '../utils/constants';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Your chosen theme
import 'primeicons/primeicons.css';


const Campaign = () => {

  const { fetchCampaign, campaign, loading } = useCampaignStore();
  const {
    fullName,
    setFullName,
    setAmount,
    amount,
    email,
    setEmail,
    toggleEmailOptIn,
    emailOptIn,
    setCurrency,
    currency,
  } = useDonorStore();
  console.log('lastName',fullName)


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
  }
  
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
              <label htmlFor="fullName" className="label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="donationAmount" className="label">Donation Amount</label>
              <input
                type="number"
                id="donationAmount"
                name="donationAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input"
                min="0"
                step="0.01"
              />
            </div>

            <div className="typeahead-form-group"> 
              <label htmlFor="currency-typeahead" className="label">Currency Type</label>
              <Typeahead
              id="currency-typeahead"
              labelKey="name" //TODO: change this and enum to currency
              onChange={setCurrency}
              options={CURRENCY_CODE}
              placeholder="Select currency..."
              selected={currency}
              className="custom-typeahead" 
              maxResults={1}
              paginate={false}
            />


              
            </div>


            <div className="mb-3">
            <label htmlFor="emailOptInCheckbox" className="custom-checkbox-label">
              <input
                type="checkbox"
                id="emailOptInCheckbox"
                checked={emailOptIn}
                onChange={toggleEmailOptIn}
                className="custom-checkbox-label" // Adds margin between checkbox and label
              />
              Opt in for emails.
            </label>
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