

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import useDonorStore from 'src/pages/donor/store'
import Loading from "src/components/Loading";
import DonationBar from 'src/pages/donor/donation/components/ProgressBar';
import { NumericFormat } from 'react-number-format';
import { RiInstagramLine } from "react-icons/ri";
import DonationEvents from "src/pages/donor/donation/components/Events"

import defaultImg from 'src/assets/images/defaultImg.jpg';



const Donation = () => {
  const [imageUrl, setImageUrl] = useState(defaultImg);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
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
    setIsEmailSubscription,
    isEmailSubscription,
    activeButton,
    setActiveButton,
  } = useDonorStore();

  useEffect(() => {
    getUserLocation()
    fetchCampaign().then(data => {
      setImageUrl(data.image_url || defaultImg);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setRaised(data.raised || 0);
      setGoal(data.goal || 0);
      setTotalDonations(data.total_donations || 0);
    });
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
      <div className="bg-[#86c88b]">
        <div className=" flex justify-center w-full mt-16 ">
          <div className=" bg-[#ffffff] w-110 rounded-lg  shadow-lg mt-4 mb-4 ">
            <div className="rounded-lg  w-full">
              <img
                src={imageUrl || defaultImg}
                alt="ui/ux review check"
                className='rounded-t-lg shadow-none  h-100 w-full object-cover'
              />
              {goal &&
                <DonationBar
                  raised={raised || 0}
                  goal={goal || 0}
                />
              }
              {goal &&
                <div className="pt-2 pb-7 px-8 bg-white rounded-b-lg ">
                  <div className=' mt-3 text-right'>
                    <div className="text-md">
                      <NumericFormat
                        value={raised || 0}
                        thousandSeparator={true}
                        prefix="$"
                        decimalScale={2}
                        displayType="text"
                      /> {' '}raised
                    </div>
                    <div className='text-sm text-gray-400 font-light'>
                      <NumericFormat
                        value={goal || 0}
                        thousandSeparator={true}
                        prefix="$"
                        decimalScale={2}
                        displayType="text"
                      />{' '}goal · {''}
                      <NumericFormat
                        value={totalDonations || 0}
                        thousandSeparator={true}
                        displayType="text"
                      /> donations
                    </div>
                  </div>
                </div>
              }
              <div className="p-6">
                <div className="text-2xl font-bold">
                  {title || 'Select Gift Amount'}
                </div>
                <div className="text-md m-3 text-gray-600">
                  {description || 'Your donation will help us achieve our goals and make a difference in the community.'}
                </div>
                <div className="mb-3 text-gray-400">
                  _ _ _
                </div>
                <form onSubmit={handleDonateClick}>
                  <div>One-time donation</div>
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
                    required
                    type="email"
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Email"
                    className='border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
                  />
                  <input
                    required
                    type="text"
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Name"
                    className=' border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
                  />


                  <div className="mt-4 mb-5 ">
                    <div className=" m-2 text-sm text-gray-400 font-light">

                      <div className="inline-flex items-center mr-1">
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            checked={isEmailSubscription}
                            onChange={setIsEmailSubscription}
                            type="checkbox"
                            className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded  hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check-custom-icon" />

                          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                          </span>
                        </label>
                        <label >I would like to recieve email updates</label>
                      </div>

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
                        <label >I would like my donation to be anonymous</label>
                      </div>
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
      </div >
    </div >
  )
};
export default Donation;