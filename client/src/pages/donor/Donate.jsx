

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import useDonateStore from 'src/stores/Donate'
import Loading from "src/components/Loading";
import DonationBar from 'src/components/DonationBar';
import { NumericFormat } from 'react-number-format';
import { RiInstagramLine } from "react-icons/ri";
import DonationEvents from "src/components/DonationEvents"
import logo from 'src/assets/images/logo.png';


import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import ActiveCampaign from 'src/pages/donor/components/ActiveCampaign';
import InactiveCampaign from 'src/pages/donor/components/InactiveCampaign';

const Donate = () => {
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

  } = useDonateStore();



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

      <div className="fixed top-0 text-center w-full  bg-white  py-3 shadow-md z-10">
        <img className="w-40 mx-auto" src={logo} alt="A descriptive alt text for my image" />
      </div>
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
export default Donate