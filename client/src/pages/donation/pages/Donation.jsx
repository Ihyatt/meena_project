// React and hooks
import React, { useRef, useEffect, useState, useMemo } from "react";

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
import Button from "src/pages/donation/components/Button";
import DonorActivity from "src/pages/donation/components/DonorActivity";
import CampaignTitle from "src/pages/donation/components/CampaignTitle";

// Constants and environment variables
const frotendUrl = import.meta.env.VITE_FROTEND_API_URL;

const Donation = () => {
  const [campaignData, setCampaignData] = useState({
    imageUrl: defaultImg,
    title: "",
    description: "",
    raised: 0,
    goal: 0,
    totalDonations: 0,
    activeCampaign: false,
    donorsCount: 0,
  });
  const [copyText, setCopyText] = useState("SHARE LINK");
  const [donorsCount, setDonorsCount] = useState(0);
  const targetRef = useRef(null);

  const { setLat, setLng, fetchCampaign, isLoading } = useDonateStore();

  useEffect(() => {
    getUserLocation();
    fetchCampaign().then((data) => {
      setCampaignData({ ...data });
    });
  }, [fetchCampaign]);

  const percentage = useMemo(() => {
    if (goal === 0) return 0; // Avoid division by zero
    return Math.min(Math.floor((campaign.raised / campaign.goal) * 100), 100); // Cap at 100%
  }, [campaign.raised, campaign.goal]); // Dependency array: the "anchor points"

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
    const amountAsNumber = Number(newAmount);
    setCampaignData((prevData) => ({
      ...prevData,
      raised: prevData.raised + amountAsNumber,
      totalDonations: prevData.totalDonations + 1,
    }));
  };

  const handleDonorUpdate = () => {
    setCampaignData((prevData) => ({
      ...prevData,
      donorsCount: prevData.donorsCount + 1,
    }));
  };

  console.log(activeCampaign);

  return (
    <div>
      {isLoading && <Loading />}
      <CampaignTitle title={campaignData.title} />
      <div className="">
        <CoverImage imageUrl={campaignData.imageUrl} />
        <div className=" ">
          <div className="block lg:hidden">
            <DonationData
              percentage={percentage}
              activeCampaign={campaignData.activeCampaign}
              goal={campaignData.goal}
              raised={campaignData.raised}
              totalDonations={campaignData.totalDonations}
            />
          </div>
          <About description={campaignData.description} />
          <DonationForm targetRef={targetRef} />
        </div>
        <div className="hidden lg:block col-span-3 ">
          <CeoData />
          <DonationData
            percentage={percentage}
            activeCampaign={campaignData.activeCampaign}
            goal={campaignData.goal}
            raised={campaignData.raised}
            totalDonations={campaignData.totalDonations}
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

            <DonorActivity donorsCount={campaignData.donorsCount} />
            <div className="mt-5">
              <DonationEvents
                handleNewDonation={handleNewDonation}
                handleDonorUpdate={handleDonorUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
