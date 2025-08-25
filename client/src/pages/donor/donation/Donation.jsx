import React, { act, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDonorStore from 'src/pages/donor/store';
import Loading from 'src/components/Loading';
import { NumericFormat } from 'react-number-format';
import { RiInstagramLine } from 'react-icons/ri';
import DonationEvents from 'src/pages/donor/donation/components/Events';
import About from 'src/pages/donor/donation/components/About';
import defaultImg from 'src/assets/images/defaultImg.jpg';
import logo from 'src/assets/images/logo.png';
import din from 'src/assets/images/din.png';
import { DefaultTitle, DefaultDescription } from 'src/utils/constants';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Donation = () => {
  const [imageUrl, setImageUrl] = useState(defaultImg);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(true);
  const [customAmount, setCustomAmount] = useState(0);
  const [textToCopy, setTextToCopy] = useState('');

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
    amount,
  } = useDonorStore();

  useEffect(() => {
    getUserLocation();
    fetchCampaign().then((data) => {
      setImageUrl(data.image_url || defaultImg);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setRaised(data.raised || 0);
      setGoal(data.goal || 0);
      setTotalDonations(data.total_donations || 0);
      setActiveCampaign(data.activeCampaign);
      console.log('Campaign data fetched:', data, activeCampaign);
    });
  }, [fetchCampaign]);

  const handleClick = (buttonId, amount) => {
    setActiveButton(buttonId);
    setAmount(amount);
    setCustomAmount('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('http://localhost:5173/');
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy url: ', err);
    }
  };



  const handleCustomAmount = (e) => {
    setAmount(e.target.value);
    setCustomAmount(e.target.value);
  };

  const handleDonateClick = () => {
    navigate(`/checkout`);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLng(longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <div className="grid grid-cols-3 gap-4 px-30  mt-5 mb-10 ">
        <div className="col-span-2  grid place-items-center">
          
          <img className="w-40" src={logo} alt="meena project logo" />
          <div className="flex flex-col justify-center pl-20 pr-3 pt-8">
            <div className="text-3xl font-bold mb-4">
            {title || DefaultTitle}
            </div>
            <img
              src={imageUrl || defaultImg}
              alt="ui/ux review check"
              className="rounded-sm shadow-md h-100 w-full object-cover"
            />
            <div className="text-left px-6">
              <div className="w-6/8 py-6">
                <About description={description} />
              </div>
              <div>
                <div className="p-15 bg-white rounded-sm shadow-lg mt-6 w-7/8">
                  <div className="text-2xl font-bold">Select Gift Amount</div>
                  <div className="mb-3 text-gray-400 text-xs">_ _ _</div>
                  <form onSubmit={handleDonateClick}>
                    <div>One-time donation</div>
                    <div
                      className="flex gap-5 my-[25px] transition-all duration-300 ease-in-out"
                      id="amountSelector"
                    >
                      {[15, 30, 100, 500].map((amount, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`
                            font-medium text-base flex-1 p-2 border border-[#cecfdb] rounded text-gray-800 cursor-pointer
                            ${
                              activeButton === `button${index + 1}`
                                ? 'bg-[#0fa347] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                                : ''
                            }
                          `}
                          onClick={() => handleClick(`button${index + 1}`, amount)}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col">
                      <input
                        required
                        type="number"
                        id="number"
                        value={customAmount }
                        onChange={handleCustomAmount}
                        placeholder="$ Custom Amount"
                        className="border border-gray-400 rounded-sm w-3/4 p-2 mb-2 focus:outline-none"
                      />
                      <input
                        required
                        type="email"
                        id="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Email"
                        className="border-b border-gray-400 w-3/4 p-2 mb-2 focus:outline-none"
                      />
                      <input
                        required
                        type="text"
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Name"
                        className="border-b border-gray-400 w-3/4 p-2 mb-2 focus:outline-none"
                      />
                    </div>

                    <div className="mt-4 mb-5">
                      <div className="m-2 text-sm text-gray-400 font-light">
                        <div className="inline-flex items-center mr-1">
                          <label className="flex items-center cursor-pointer relative mr-1">
                            <input
                              checked={isEmailSubscription}
                              onChange={setIsEmailSubscription}
                              type="checkbox"
                              className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                              id="check-custom-icon"
                            />
                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                          </label>
                          <label>I would like to receive email updates</label>
                        </div>

                        <div className="inline-flex items-center mr-1">
                          <label className="flex items-center cursor-pointer relative mr-1">
                            <input
                              type="checkbox"
                              checked={isAnonymous}
                              onChange={setIsAnonymous}
                              className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                              id="check-custom-icon"
                            />
                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                          </label>
                          <label>I would like my donation to be anonymous</label>
                        </div>
                      </div>
                    </div>

                    <div className="my-6">
                      <input
                        className="
                          font-medium text-base w-full p-[15px] bg-[#0fa347] text-white border-none rounded cursor-pointer
                          transition-colors duration-300 block mx-auto hover:bg-[#0fa347]
                        "
                        type="submit"
                        value="Donate"
                      />
                    </div>
                    <div className="mb-4">
                      <a
                        href="https://www.instagram.com/themeenaproject/"
                        className="font-light text-gray-400 inline-flex items-center vertical-align-middle hover:text-gray-500"
                      >
                        Follow Meena on Instagram <RiInstagramLine />
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 py-30 ">
          <img className="w-40 h-40 rounded-full object-cover" src={din} alt="sumayyah" />
          <div className="mt-5">
          <div className="text-sm">CEO & FOUNDER</div>
          <div className="text-2xl">SUMAYYAH DIN</div>
          </div>
          
   
              <div className="flex w-6/10 justify-between items-center mt-10 mb-5">
<div>
                  <div className="text-lg">
                    <NumericFormat
                      value={raised || 0}
                      thousandSeparator={true}
                      prefix="$"
                      decimalScale={2}
                      displayType="text"
                    />{' '}
                    raised
                  </div>
                  <div className="text-md text-gray-400 font-light">
                    <NumericFormat
                      value={goal || 0}
                      thousandSeparator={true}
                      prefix="$"
                      decimalScale={2}
                      displayType="text"
                    />
                    {' '}goal ·{' '}
                    <NumericFormat
                      value={totalDonations || 0}
                      thousandSeparator={true}
                      displayType="text"
                    />{' '}
                    donations
                  </div>
                  </div>
                  <div className="w-15 h-15  ">
              <CircularProgressbar
  value={55}
  text={`${55}%`}
  styles={buildStyles({
 
    strokeLinecap: 'butt',

    textSize: '16px',

    pathTransitionDuration: 0.5,

    pathColor: `#DB5758`,
    textColor: '#bcbcbc',
    trailColor: '#f4f2ec',
    backgroundColor: '#3e98c7',
  })}
/>
              </div>
                </div>
                <div>

                <button
            type="button"
            className="
            text-white
            bg-[#0fa347] 
            hover:bg-[#2bbd62] 
            transition-colors 
            duration-300
            font-medium 
            text-base 
            flex-1 
            px-5 
            py-2 
            rounded-sm  
            cursor-pointer 
            mr-1 
            text-sm
            "
          
          >
            DONATE NOW
          </button>
          <button
            type="button"
            className="
              text-[#0fa347]
              font-medium 
              text-base flex-1 
             
              px-5 
              py-2
               border
               border-[#0fa347] 
               rounded-sm  
               cursor-pointer
                ml-1 
                text-sm
              "
          >
            SHARE
          </button>
          <div className="mt-10"> 
            <div className="text-gray-400 ">
            RECENT DONATIONS
            </div>
            <DonationEvents />
          </div>
                </div>
              </div>
        </div>
        
      </div>
  );
};

export default Donation;
