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
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [donorsCount, setDonorsCount] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultImg);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [copyText, setCopyText] = useState("SHARE LINK");
  const targetRef = useRef(null);

  const { setLat, setLng, fetchCampaign, isLoading } = useDonateStore();

  useEffect(() => {
    fetchCampaign().then((data) => {
      setRaised(data.raised);
      setGoal(data.goal);
      setTotalDonations(data.totalDonations);
      setDonorsCount(data.donorsCount);
      setActiveCampaign(true);
      setImageUrl(data.imageUrl || defaultImg);
      setTitle(data.title || "");
      setDescription(data.description || "");
    });
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  const percentage = useMemo(() => {
    if (goal === 0) return 0; // Avoid division by zero
    return Math.min(Math.floor((raised / goal) * 100), 100); // Cap at 100%
  }, [raised, goal]); // Dependency array: the "anchor points"

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
    setRaised((prev) => prev + amountAsNumber);
  }, []);

  const handleDonorUpdate = useCallback(() => {
    setDonorsCount((prev) => prev + 1);
  }, []);

  return {
    raised,
    goal,
    totalDonations,
    donorsCount,
    activeCampaign,
    imageUrl,
    title,
    description,
    copyText,
    targetRef,
    percentage,
    handleCopy,
    scrollToTarget,
    handleNewDonation,
    handleDonorUpdate,
    isLoading,
  };
};
export default useDonation;
