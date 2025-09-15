import "src/assets/css/CampaignForm.css";

import { useEffect, useState } from "react";

import useDraftStore from "src/pages/campaign/store";

import Progressbar from "src/components/Progressbar";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DraftGoal = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [closeoutDate, setCloseoutDate] = useState(new Date());

  const { fetchDraft, saveDraft, isLoading, error } = useDraftStore();

  useEffect(() => {
    fetchDraft().then((data) => {
      setTitle(data.title);
      setCampaignId(data.id);
      setDescription(data.description);
      setGoal(data.goal || 0);
      setImageUrl(data.imageUrl);
      setCloseoutDate(data.closeoutDate);
    });
  }, []);

  const handleGoalAmount = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const amountValue = parseFloat(cleanedValue);
    setGoal(amountValue);
  };
  const handleSave = (event) => {
    event.preventDefault();
    saveDraft(campaignId, title, description, goal, closeoutDate).then(
      (data) => {
        if (!error) {
          navigate("/draft/campaign-image");
        } else {
          console.error("Error saving draft", data);
        }
      }
    );
  };

  const isButtonDisabled = !goal || goal <= 0.1 || goal > 1000000 || isLoading;
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const step = 3;
  const stepText = "How much would you like to raise?";
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
            <div className=" border border-gray-400  p-2 rounded-sm  flex items-center justify-between mb-3 min-w-75 text-lg font-semibold w-full h-14 bg-transparent hover:bg-[#fafafa] placeholder:text-slate-400 text-slate-700  border border-[#b7b7b6] rounded-lg px-3 py-2 transition duration-300  focus:outline-none focus-within:border-[#232323] focus-within:border-2 ">
              <div className="flex flex-col text-xs items-center">
                <div>$</div>
                <div>USD</div>
              </div>
              <div className="text-2xl">
                <input
                  type="number"
                  pattern="[0-9]"
                  title="only numbers"
                  value={goal}
                  onChange={handleGoalAmount}
                  onKeyDown={blockInvalidChar}
                  className="border-none rounded-sm focus:outline-none text-right"
                />
                <span className="">.00</span>
              </div>
            </div>
          </form>
        </div>
        <footer className="w-full flex flex-col ">
          <Progressbar progress={(3 / 6) * 100} />
          <div className=" flex w-full p-10 justify-between items-center">
            <div>
              <Link
                to={"/draft/description"}
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
export default DraftGoal;
