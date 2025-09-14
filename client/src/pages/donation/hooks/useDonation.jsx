import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
const frotendUrl = import.meta.env.VITE_FROTEND_API_URL;
import defaultImg from "src/assets/images/defaultImg.jpg";
import useDonateStore from "src/pages/donation/store";

const useDonation = () => {
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
  const targetRef = useRef(null);

  const { setLat, setLng, fetchCampaign, isLoading } = useDonateStore();

  useEffect(() => {
    fetchCampaign().then((data) => {
      setCampaignData({ ...data });
    });
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  const percentage = useMemo(() => {
    if (campaignData.goal === 0) return 0; // Avoid division by zero
    return Math.min(
      Math.floor((campaignData.raised / campaignData.goal) * 100),
      100
    ); // Cap at 100%
  }, [campaignData.raised, campaignData.goal]); // Dependency array: the "anchor points"

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

  const handleNewDonation = useCallback((newAmount) => {
    const amountAsNumber = Number(newAmount);
    setCampaignData((prevData) => ({
      ...prevData,
      raised: prevData.raised + amountAsNumber,
      totalDonations: prevData.totalDonations + 1,
    }));
  }, []);

  const handleDonorUpdate = useCallback(() => {
    setCampaignData((prevData) => ({
      ...prevData,
      donorsCount: prevData.donorsCount + 1,
    }));
  }, []);

  return {
    campaignData,
    copyText,
    targetRef,
    isLoading,
    percentage,
    handleCopy,
    scrollToTarget,
    handleNewDonation,
    handleDonorUpdate,
    isLoading,
  };
};
export default useDonation;
