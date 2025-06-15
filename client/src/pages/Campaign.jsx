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

  // console.log("setAmount:", setAmount);
  // console.log("toggleEmailOptIn:", toggleEmailOptIn);

  // You had these commented out. If you actually want to fetch campaign data, uncomment them.
  // useEffect(() => {
  //   fetchCampaign()
  // }, []);
  // console.log(firstName)
  // const navigate = useNavigate();

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // // if (campaign.isError) {
  // //   return <div>Error loading posts.</div>;
  // // }

  // const handleDonateClick = () => {
  //
  //   navigate(`/campaigns/${campaign.id}/checkout`);
  // };
  console.log(lastName)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // This `handleChange` function seems to be part of the form you pasted.
  // It has `type` and `checked` which aren't used for `name`, `email`, `message`.
  // It's good to ensure your `handleChange` function correctly updates the state
  // for all form fields.
  // For the contact form you provided, a simpler handleChange might be:
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };

  // Dummy campaign data for demonstration if `useCampaignStore` is not fully set up
  // or if `campaign` is undefined during initial render.
  // REMOVE THIS BLOCK if your `useCampaignStore` reliably provides `campaign.title` and `campaign.description`.
  const dummyCampaign = {
    title: "Support Our Community Outreach",
    description: "Your contributions empower us to make a real difference in the lives of those in need. Join us in building a stronger, more vibrant community.",
  };
  const currentCampaign = campaign || dummyCampaign; // Use actual campaign or dummy

  return (
    <div className="pageContainer">
      {/* Left Section: Image with Overlay Text */}
      <div className="imageSection">
        {/* NEW: Container for the overlay text */}
        <div className="image-overlay-text-container">
          {/* Ensure campaign.title and campaign.description exist before rendering */}
          {currentCampaign.title && <h2>{currentCampaign.title}</h2>}
          {currentCampaign.description && <p>{currentCampaign.description}</p>}
        </div>
      </div>

      {/* Right Section: Input Form (seamless with black background) */}
      <div className="formSection">
        <div className="formContentWrapper">
          <h2 className="heading">Send Us A Message</h2> {/* This heading is for the form */}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="message" className="label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="input textarea"
              />
            </div>
            <button
              type="submit"
              className="button"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Campaign;