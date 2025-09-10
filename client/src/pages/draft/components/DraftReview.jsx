import "src/assets/css/CampaignForm.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useDraftStore from "src/pages/draft/store";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Progressbar from "src/components/Progressbar";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const DraftReview = () => {
  const [title, setTitle] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [closeoutDate, setCloseoutDate] = useState(null);

  const { fetchDraft, saveDraft, isLoading } = useDraftStore();

  useEffect(() => {
    fetchDraft().then((data) => {
      console.log(data);
      setTitle(data.title);
      setCampaignId(data.id);
      setDescription(data.description);
      setGoal(data.goal);
      setImageUrl(data.imageUrl);
      setCloseoutDate(data.closeoutDate);
    });
  }, [fetchDraft]);

  const handleDateChange = (newDate) => {
    setCloseoutDate(newDate);
    // You can now use the newDate variable here
  };

  const step = 5;
  const stepText = "Set closeout date for your campaign";
  const isButtonDisabled = !closeoutDate || isLoading;
  console.log(closeoutDate);
  return (
    <div className="flex col w-full h-screen  bg-[#f5f5f5]">
      <div className="sm:w-50/100  md:w-40/100  lg:w-34/100  h-screen ">
        <div className="pt-45 px-10 md:px-20 lg:px-20">
          <div className=" font-normal text-md pb-4  mb-4 border-b-2 border-[#0fa347] transition-colors duration-300">
            {" "}
            {step} of 5
          </div>

          <div className=" font-light text-5xl">{stepText}</div>
        </div>{" "}
      </div>
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="sm:px-5 md:px-20 lg:px-35 pt-46 ">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">Title</div>
              <div>title data</div>
            </div>
            <div>
              <div className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3]  px-4 py-1 rounded-full cursor-pointer">
                edit
              </div>
            </div>
          </div>
          <div className=" border-[0.5px] border-b-[#f5f1ed] " />
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">Description</div>
              <div>Description data</div>
            </div>
            <div>
              <div className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3]  px-4 py-1 rounded-full cursor-pointer">
                edit
              </div>
            </div>
          </div>
          <div className=" border-[0.5px] border-b-[#f5f1ed] " />
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">Campaign goal</div>
              <div>$100</div>
            </div>
            <div>
              <div className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3]  px-4 py-1 rounded-full cursor-pointer">
                edit
              </div>
            </div>
          </div>
          <div className=" border-[0.5px] border-b-[#f5f1ed] " />
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">Date</div>
              <div>1/1/2023</div>
            </div>
            <div>
              <div className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3]  px-4 py-1 rounded-full cursor-pointer">
                edit
              </div>
            </div>
          </div>
          <div className=" border-[0.5px] border-b-[#f5f1ed] " />
        </div>
        <footer className="w-full flex flex-col ">
          <Progressbar progress={(5 / 6) * 100} />
          <div className=" flex w-full p-10 justify-between items-center">
            <div>
              <Link
                to={"/draft/date"}
                style={{ color: "black", fontSize: "15px" }}
              >
                <RiArrowLeftSLine size={40} />
              </Link>
            </div>
            <div>
              {!isButtonDisabled ? (
                <Link
                  to={"/draft/review"}
                  style={{ color: "black", fontSize: "15px" }}
                >
                  <div
                    className="
                font-medium 
                text-base 
                flex-1 
                px-7 py-4
                border-none
                rounded 
                cursor-pointer
                rounded-full
                text-white bg-[#0fa347] hover:bg-[#2bbd62]
              "
                  >
                    {" "}
                    CONTINUE
                  </div>
                </Link>
              ) : (
                <div
                  className="
                font-semibold 
                text-base 
                flex-1 
                px-7 py-4
                border-none
                rounded 
                cursor-not-allowed
                rounded-full
                bg-[#d8d8d8] text-slate-700 "
                >
                  {" "}
                  CONTINUE
                </div>
              )}
            </div>
          </div>
        </footer>{" "}
      </div>
    </div>
  );
};
export default DraftReview;
