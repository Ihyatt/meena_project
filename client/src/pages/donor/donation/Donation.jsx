import React, { useRef, useEffect, useState } from "react";

import useDonateStore from "src/pages/donor/store";
import Loading from "src/components/Loading";
import { NumericFormat } from "react-number-format";
import DonationEvents from "src/components/Events";
import About from "src/pages/donor/donation/components/About";
import defaultImg from "src/assets/images/defaultImg.jpg";
import logo from "src/assets/images/logo.png";
import din from "src/assets/images/din.png";
import { DefaultTitle } from "src/utils/constants";
import DonationForm from "src/pages/donor/donation/components/DonationForm";
import DonationData from "src/pages/donor/donation/components/DonationData";
import DonationContext from "src/pages/donor/donation/components/DonationContext";
import { FaArrowTrendUp } from "react-icons/fa6";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const frotendUrl = import.meta.env.VITE_FROTEND_API_URL;

const Donation = () => {
  const [imageUrl, setImageUrl] = useState(defaultImg);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [copyText, setCopyText] = useState("SHARE LINK");
  const [activeCampaign, setActiveCampaign] = useState(true);
  const [donorsCount, setDonorsCount] = useState(0);
  const targetRef = useRef(null);

  const { setLat, setLng, fetchCampaign, isLoading } = useDonateStore();

  useEffect(() => {
    getUserLocation();
    fetchCampaign().then((data) => {
      setImageUrl(data.image_url || defaultImg);
      setTitle(data.title);
      setDescription(data.description);
      setRaised(data.raised);
      setGoal(data.goal);
      setTotalDonations(data.totalDonations);
      setDonorsCount(data.donorsCount);
      setActiveCampaign(data.activeCampaign);
    });
  }, [fetchCampaign]);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(frotendUrl);
      setCopyText("COPIED!");
      setTimeout(() => {
        setCopyText("SHARE LINK");
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  const scrollToTarget = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  const handleNewDonation = (newAmount) => {
    setRaised((prevRaised) => {
      const amountAsNumber = Number(newAmount);
      const prevRaisedAsNumber = Number(prevRaised);
      return prevRaisedAsNumber + amountAsNumber;
    });
  };

  const donationContextValue = {
    handleDonationUpdate: handleNewDonation,
    handleDonorUpdate: () => setDonorsCount((prev) => prev + 1),
  };

  return (
    <div>
      {isLoading && <Loading />}

      <div className="flex justify-center">
        <div className=" min-w-210 max-w-210  flex flex-col justify-center pl-20 pt-8">
          <div className="text-4xl font-bold mb-4">{title || DefaultTitle}</div>
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
              <DonationForm targetRef={targetRef} />
            </div>
          </div>
        </div>

        <div className=" ml-5 mt-22 min-w-90 shadow-lg rounded-sm p-8 h-250">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src={din}
            alt="sumayyah"
          />
          <div className="mt-5 mb-15">
            <div className="text-sm">CEO & FOUNDER</div>

            <div className="text-2xl">SUMAYYAH DIN</div>
          </div>

          <div className="flex justify-start items-center mt-5 mb-3">
            <FaArrowTrendUp
              size={35}
              color="#DB5758"
              className="inline bg-[#edafb0] rounded-full p-1"
            />{" "}
            <div className="text-lg  ml-3 text-[#DB5758]">
              {donorsCount} people just donated
            </div>
          </div>

          {activeCampaign == true ? (
            <DonationData
              goal={goal}
              raised={raised}
              totalDonations={totalDonations}
            />
          ) : (
            <div className="flex w-58 flex-col mb-5">
              <div className="text-lg font-light">
                <NumericFormat
                  value={raised || 0}
                  thousandSeparator={true}
                  prefix="$"
                  decimalScale={2}
                  displayType="text"
                />{" "}
                raised
              </div>
            </div>
          )}

          <div className="w-73">
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
            text-md
            "
              onClick={scrollToTarget}
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
                hover:border-[#2bbd62] 
                hover:text-[#2bbd62] 
               rounded-sm  
               cursor-pointer
                ml-1 
                text-md
              "
              onClick={handleCopy}
            >
              {copyText}
            </button>
            <div className="mt-10">
              <div className="text-gray-400 ">RECENT DONATIONS</div>
              <DonationContext.Provider value={donationContextValue}>
                <DonationEvents />
              </DonationContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
