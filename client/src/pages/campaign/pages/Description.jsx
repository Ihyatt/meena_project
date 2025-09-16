import React, { useEffect, useState } from "react";
import useDraftStore from "src/pages/campaign/store";

import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Progressbar from "src/components/Progressbar";

import "src/assets/css/CampaignForm.css";
import { da } from "date-fns/locale";

const DraftDescription = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [closeoutDate, setCloseoutDate] = useState(new Date());

  const descriptioncharactersLimit = 2000;

  const { fetchDraft, saveDraft, isLoading, error } = useDraftStore();

  useEffect(() => {
    fetchDraft().then((data) => {
      setTitle(data.title);
      setCampaignId(data.id);
      setDescription(data.description || "");
      setGoal(data.goal);
      setImageUrl(data.imageUrl);
      setCloseoutDate(data.closeoutDate);
    });
  }, []);

  const handleSave = (event) => {
    event.preventDefault();
    saveDraft(campaignId, title, description, goal, closeoutDate).then(
      (data) => {
        if (!error) {
          navigate("/draft/goal");
        } else {
          console.error("Error saving draft", data);
        }
      }
    );
  };

  const step = 2;
  const stepText = "Describe your campaign";
  const isButtonDisabled =
    description.length < 5 ||
    description.length > descriptioncharactersLimit ||
    isLoading;

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
        <div className="sm:px-5 md:px-20 lg:px-35 pt-52 ">
          <form className="">
            <div className="p-2">
              <textarea
                id="description"
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-w-75 
                  resize-none w-full h-75 p-4 border rounded
                  
                  text-lg font-semibold w-full h-14 bg-transparent placeholder:text-slate-400 text-slate-700  border border-[#b7b7b6] rounded-lg px-3 py-2  focus:outline-none   "
              ></textarea>
            </div>
          </form>
        </div>

        <footer className="w-full flex flex-col ">
          <Progressbar progress={(2 / 6) * 100} />
          <div className=" flex w-full p-10 justify-between items-center">
            <div>
              <Link
                to={"/draft/title"}
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
                rounded-full


                cursor-pointer
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
                bg-[#d8d8d8] text-slate-700 "
                >
                  {" "}
                  CONTINUE
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default DraftDescription;
