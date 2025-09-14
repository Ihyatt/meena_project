// React and hooks
import React, { useRef, useEffect, useState } from "react";

// External libraries
import { NumericFormat } from "react-number-format";
import { FaArrowTrendUp } from "react-icons/fa6";

// Local components and assets
import Loading from "src/components/Loading";
import DonationEvents from "src/components/Events";
import About from "src/pages/donation/components/About";
import defaultImg from "src/assets/images/defaultImg.jpg";
import DonationForm from "src/pages/donation/components/DonationForm";
import DonationData from "src/pages/donation/components/DonationData";

import CoverImage from "src/pages/donation/components/CoverImage";
import CeoData from "src/pages/donation/components/CeoData";

// Context and state management
import useDonateStore from "src/pages/donation/store";
import DonationContext from "src/components/DonationContext";
import Button from "src/pages/donation/components/Button";

// Constants and environment variables
import { DEFAULT_TITLE } from "src/utils/constants";
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
      setImageUrl(data.imageUrl || defaultImg);
      setTitle(data.title);
      setDescription(data.description);
      setRaised(data.raised);
      setGoal(data.goal);
      setTotalDonations(data.totalDonations);
      setDonorsCount(data.donorsCount || 0);
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
  console.log(activeCampaign);

  return (
    <div>
      {isLoading && <Loading />}
      <div className=" ">
        <div className=" text-5xl font-bold ">{title || DEFAULT_TITLE}</div>
      </div>
      <div className="">
        <CoverImage imageUrl={imageUrl} />
        <div className=" ">
          <div className="block lg:hidden">
            <DonationData
              activeCampaign={activeCampaign}
              goal={goal}
              raised={raised}
              totalDonations={totalDonations}
            />
          </div>
          <About description={description} />
          <DonationForm targetRef={targetRef} />
        </div>
        <div className="hidden lg:block col-span-3 ">
          <CeoData />
          <DonationData
            activeCampaign={activeCampaign}
            goal={goal}
            raised={raised}
            totalDonations={totalDonations}
          />

          <div className="">
            <Button
              onClick={scrollToTarget}
              className=" mr-1 text-white bg-[#0fa347] hover:bg-[#2bbd62]"
            >
              DONATE NOW
            </Button>
            <Button
              onClick={handleCopy}
              className=" text-[#0fa347]  border border-[#0fa347] hover:border-[#2bbd62] hover:text-[#2bbd62]  ml-1 "
            >
              {copyText}
            </Button>

            {donorsCount > 0 && (
              <div className="flex justify-start items-center mt-5 mb-3">
                <FaArrowTrendUp
                  size={35}
                  color="#DB5758"
                  className="inline bg-[#edafb0] rounded-full p-1"
                />{" "}
                <div className="text-sm font-bold  ml-3 text-[#DB5758]">
                  {donorsCount} {donorsCount == 1 ? "person " : "people "}
                  just donated
                </div>
              </div>
            )}
            <div className="mt-5">
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
