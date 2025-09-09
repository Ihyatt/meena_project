import "src/assets/css/CampaignForm.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useDraftStore from "src/pages/draft/store";

import Progressbar from "src/components/Progressbar";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DraftDate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [closeoutDate, setCloseoutDate] = useState(new Date());
  const { fetchDraft, saveDraft, isLoading } = useDraftStore();

  useEffect(() => {
    fetchDraft().then((data) => {
      setTitle(data.title);
      setCampaignId(data.id);
      setDescription(data.description);
      setGoal(data.goal);
      setImageUrl(data.imageUrl);
      setCloseoutDate(data.closeoutDate);
    });
  }, [fetchDraft]);

  const handleSave = (event) => {
    event.preventDefault();
    saveDraft(campaignId, title, description, goal, imageUrl, closeoutDate)
      .then((data) => {
        if (data.status == "success") {
          navigate("/draft/review");
        } else {
          console.error("Error saving draft", data);
        }
      })
      .catch((error) => {
        console.error("Failed to Save", error);
      });
  };

  const step = 5;
  const stepText = "Set closeout date for your campaign";
  const isButtonDisabled = !closeoutDate || isLoading;
  console.log("closeoutDate", closeoutDate);
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
      <div class=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="flex sm:px-5 md:px-20 lg:px-35 pt-46 items-center justify-center">
          <DatePicker
            selected={closeoutDate}
            onChange={(date) => setCloseoutDate(date)}
            className="w-full max-w-md text-lg font-semibold h-14 bg-transparent hover:bg-[#fafafa] placeholder:text-slate-400 text-slate-700 border border-[#b7b7b6] rounded-lg px-3 py-2 transition duration-300 focus:outline-none focus-within:border-[#232323] focus-within:border-2"
          />
        </div>
        <footer className="w-full flex flex-col ">
          <Progressbar progress={(5 / 6) * 100} />
          <div className=" flex w-full p-10 justify-between items-center">
            <div>
              <Link
                to={"/draft/campaign-image"}
                style={{ color: "black", fontSize: "15px" }}
              >
                <RiArrowLeftSLine size={40} />
              </Link>
            </div>
            <div>
              {!isButtonDisabled ? (
                <div
                  onClick={handleSave}
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
export default DraftDate;
