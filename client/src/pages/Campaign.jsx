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

  const [selectedOption, setSelectedOption] = useState([]);
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
  
  const handleClick = () => {
    const newSelectedOption = [options[0]];
    setSelectedOption(newSelectedOption);
  };
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
              <label htmlFor="fullName" className="label">First Name</label>
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

            {/* Typeahead for Currency */}
            {/* Added a simple div wrapper to explicitly control its margin,
                though .rbt-input-wrapper should already be handled. */}
            <div className="typeahead-form-group"> {/* New wrapper for consistent spacing */}
              <label htmlFor="currency-typeahead" className="label">Currency Type</label>
              <Typeahead
              id="currency-typeahead"
              labelKey="name" // Assuming CURRENCY_CODE items have a 'name' property
              onChange={setCurrency}
              options={CURRENCY_CODE}
              placeholder="Select currency..."
              selected={currency}// Typeahead expects an array for 'selected'
              className="custom-typeahead" // Add a custom class for easier targeting
              maxResults={1}
              paginate={false}
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