

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import useDonorStore from 'src/stores/Donor'
import Loading from "src/components/Loading";
import DonationBar from 'src/components/DonationBar';
import { NumericFormat } from 'react-number-format';
import { RiInstagramLine } from "react-icons/ri";
import DonationEvents from "src/components/DonationEvents"


import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import ActiveCampaign from 'src/pages/donor/payment/components/ActiveCampaign';
import InactiveCampaign from 'src/pages/donor/payment/components/InactiveCampaign';

const Donation = () => {
  const navigate = useNavigate();

  const {
    fullName,
    setFullName,
    setAmount,
    emailAddress,
    setLat,
    setLng,
    setEmailAddress,
    setIsAnonymous,
    isAnonymous,
    fetchCampaign,
    isLoading,
    setSubscribed,
    subscribed,
    campaign,
    activeButton,
    setActiveButton

  } = useDonorStore();



  useEffect(() => {
    getUserLocation()
    fetchCampaign()
  }, [fetchCampaign]);

  const handleClick = (buttonId, amount) => {
    setActiveButton(buttonId);
    setAmount(amount)
  };

  const handleDonateClick = () => {
    navigate(`/checkout`);
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude)
          setLng(longitude)
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  let CampaignDisplay = null;
  if (campaign) {
    CampaignDisplay = <ActiveCampaign handleDonateClick={handleDonateClick} handleClick={handleClick} activeButton={activeButton} />;
  } else {
    CampaignDisplay = <InactiveCampaign handleDonateClick={handleDonateClick} handleClick={handleClick} activeButton={activeButton} />
  }


  return (
    <div>
      {isLoading && <Loading />}
      <div className="bg-[#86c88b]">
        <div className=" flex justify-center w-full mt-16 ">
          {CampaignDisplay}
          <div className="mt-2 ml-5 w-70">
            <DonationEvents />
          </div>
        </div>
      </div>
    </div >
  )
};
export default Donation;