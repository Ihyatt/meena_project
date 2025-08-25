import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useDonorStore from "src/pages/donor/store";
import Loading from "src/components/Loading";
import { NumericFormat } from "react-number-format";
import { RiInstagramLine } from "react-icons/ri";
import DonationEvents from "src/pages/donor/donation/components/Events";
import About from "src/pages/donor/donation/components/About";
import defaultImg from "src/assets/images/defaultImg.jpg";
import logo from "src/assets/images/logo.png";
import din from "src/assets/images/din.png";
import { DefaultTitle, DefaultDescription } from "src/utils/constants";
import DonationBar from "src/pages/donor/donation/components/DonationBar";
import DonationForm from "src/pages/donor/donation/components/DonationForm";

const Donation = () => {
  const [imageUrl, setImageUrl] = useState(defaultImg);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(true);
  const [textToCopy, setTextToCopy] = useState("");
  const targetRef = useRef(null);

  const { setLat, setLng, fetchCampaign, isLoading } = useDonorStore();

  useEffect(() => {
    getUserLocation();
    fetchCampaign().then((data) => {
      setImageUrl(data.image_url || defaultImg);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setRaised(data.raised || 0);
      setGoal(data.goal || 0);
      setTotalDonations(data.total_donations || 0);
      setActiveCampaign(data.activeCampaign);
      console.log("Campaign data fetched:", data, activeCampaign);
    });
  }, [fetchCampaign]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("http://localhost:5173/");
      alert("Copied to clipboard!");
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

  return (
    <div>
      {isLoading && <Loading />}
      <div className="grid grid-cols-3 gap-4 px-30  mt-5 mb-10 ">
        <div className="col-span-2  grid place-items-center">
          <img className="w-40" src={logo} alt="meena project logo" />
          <div className="flex flex-col justify-center pl-20 pr-3 pt-8">
            <div className="text-4xl font-bold mb-4">
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
                <DonationForm targetRef={targetRef} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 py-40 ">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src={din}
            alt="sumayyah"
          />
          <div className="mt-5">
            <div className="text-sm">CEO & FOUNDER</div>
            <div className="text-2xl">SUMAYYAH DIN</div>
          </div>

          <div className="flex w-58 flex-col mt-10 mb-5">
            <div>
              <div className="text-lg">
                <NumericFormat
                  value={raised || 50}
                  thousandSeparator={true}
                  prefix="$"
                  decimalScale={2}
                  displayType="text"
                />{" "}
                raised
              </div>
              <div className="text-md text-gray-400 font-light">
                <NumericFormat
                  value={goal || 100}
                  thousandSeparator={true}
                  prefix="$"
                  decimalScale={2}
                  displayType="text"
                />{" "}
                goal ·{" "}
                <NumericFormat
                  value={totalDonations || 5}
                  thousandSeparator={true}
                  displayType="text"
                />{" "}
                donations
              </div>
            </div>
            <div className="mt-2 mb-1">
              <DonationBar raised={50} goal={100} />
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
                text-sm
              "
              onClick={handleCopy}
            >
              SHARE
            </button>
            <div className="mt-10">
              <div className="text-gray-400 ">RECENT DONATIONS</div>
              <DonationEvents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
