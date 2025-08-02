

import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import useDonateStore from 'src/stores/Donate'
import Loading from "src/components/Loading";
import DonationBar from 'src/components/DonationBar';
import { NumericFormat } from 'react-number-format';
import { RiInstagramLine } from "react-icons/ri";
import MasterDonationBar from "src/components/MasterDonationBar";
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

const Donate = () => {
  const navigate = useNavigate();

  const {
    fullName,
    setFullName,
    setAmount,
    emailAddress,
    setLat,
    setLng,
    setActiveButton,
    activeButton,
    setEmailAddress,
    setIsAnonymous,
    isAnonymous,
    fetchCampaign,
    isLoading,
    setSubscribed,
    subscribed,
    campaign,
    masterCampaign,

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

  return (
    <div>
      {isLoading && <Loading />}

      <div className="fixed top-0 text-center w-full  bg-white  py-3 shadow-md z-10">
        <img className="w-40 mx-auto" src={logo} alt="A descriptive alt text for my image" />
      </div>
      <div className="bg-[#86c88b]">
        <div className=" flex justify-center w-full mt-16 ">
          <div className=" w-110 rounded-lg  shadow-lg mt-4 mb-4 ">
            <div className="rounded-lg  w-full">
              <img
                src={campaign?.imageUrl || null}
                alt="ui/ux review check"
                className='rounded-t-lg shadow-none  h-100 w-full object-cover'
              />

              <DonationBar
                raised={campaign?.raised || 0}
                goal={campaign?.goal || 0}
              />


              <div className="pt-2 pb-7 px-8 bg-white rounded-b-lg ">

                <div>
                  <div className=' mt-3 text-right'>
                    <div className="text-md">
                      <NumericFormat
                        value={campaign?.raised || 0}
                        thousandSeparator={true}
                        prefix="$"
                        decimalScale={2}
                        displayType="text"
                      /> {' '}raised
                    </div>
                    <div className='text-sm text-gray-400 font-light'>
                      <NumericFormat
                        value={campaign?.goal || 0}
                        thousandSeparator={true}
                        prefix="$"
                        decimalScale={2}
                        displayType="text"
                      />{' '}goal · {''}
                      <NumericFormat
                        value={campaign?.totalDonations || 0}
                        thousandSeparator={true}
                        displayType="text"
                      /> donations
                    </div>
                  </div>
                </div>

                <div className="text-2xl font-bold">

                  {campaign?.title || ''}
                </div>
                <div className="text-md m-3 text-gray-600">
                  {campaign?.description || ''}
                </div>
                <div className="mb-3 text-gray-400">
                  _ _ _
                </div>

                <form onSubmit={handleDonateClick}>

                  <div>Select amount</div>
                  <div className="flex gap-5 my-[25px] transition-all duration-300 ease-in-out" id="amountSelector">
                    <button
                      type="button"
                      className={
                        `
                      font-medium
                      text-base
                      flex-1
                      p-2
                      border
                      border-[#cecfdb]
                      rounded
                      text-gray-800
                      cursor-pointer
                      ${activeButton === 'button1' ?
                          'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                          : ''}
                    `
                      }
                      onClick={() => handleClick('button1', 15)}
                    >
                      $15</button>
                    <button
                      type="button"
                      className={
                        `
                      font-medium
                      text-base
                      flex-1
                      p-2
                      border
                      border-[#cecfdb]
                      rounded
                      text-gray-800
                      cursor-pointer
                      ${activeButton === 'button2' ?
                          'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                          : ''}
                    `
                      }
                      onClick={() => handleClick('button2', 30)}
                    >
                      $30</button>
                    <button
                      type="button"
                      className={
                        `
                      font-medium
                      text-base
                      flex-1
                      p-2
                      border
                      border-[#cecfdb]
                      rounded
                      text-gray-800
                      cursor-pointer
                      ${activeButton === 'button3' ?
                          'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                          : ''}
                    `
                      }
                      onClick={() => handleClick('button3', 100)}
                    >
                      $100
                    </button>
                    <button
                      type="button"
                      className={
                        `
                      font-medium
                      text-base
                      flex-1
                      p-2
                      border
                      border-[#cecfdb]
                      rounded
                      text-gray-800
                      cursor-pointer
                      ${activeButton === 'button4' ?
                          'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                          : ''}
                    `
                      }
                      onClick={() => handleClick('button4', 500)}
                    >
                      $500
                    </button>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Email"
                    className='border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
                  />
                  <input
                    type="name"
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Name"
                    className=' border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
                  />
                  <div className="mt-4 mb-5">
                    <div className=" m-2 text-sm text-gray-400 font-light">
                      <div className="inline-flex items-center mr-1">
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            checked={subscribed}
                            onChange={setSubscribed}
                            type="checkbox"
                            className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded  hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check-custom-icon" />
                          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                          </span>
                        </label>
                      </div>
                      <label >I would like to recieve email updates</label>
                    </div>
                    <div className="m-2 text-sm text-gray-400 font-light">
                      <div className="inline-flex items-center mr-1">
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={setIsAnonymous}
                            className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded  hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check-custom-icon" />
                          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                          </span>
                        </label>
                      </div>

                      <label >I would like my donation to be anonymous</label>
                    </div>
                  </div>
                  <div className="my-6">
                    <input
                      className="
                  font-medium                 
                  text-base                  
                  max-w-[400px]               
                  w-full                      
                  p-[15px]                    
                  bg-[#DB5758]                 
                  text-white                   
                  border-none                  
                  rounded                    
                  cursor-pointer               
                  transition-colors           
                  duration-300                 
                  my-[10px]                    
                  block                        
                  mx-auto                      
                  hover:bg-[#D22D2E]           
                "
                      type="submit" name=""
                      value="Donate"
                    />
                  </div>
                  <div className="mb-4">
                    <a href="https://www.instagram.com/themeenaproject/" className=" font-light text-gray-400 inline-flex items-center vertical-align-middle hover:text-gray-500"> Follow Meena on instagram<RiInstagramLine /></a>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-2 ml-5 w-70">

            <DonationEvents />
          </div>
        </div>
      </div>
    </div >
  )
};
export default Donate