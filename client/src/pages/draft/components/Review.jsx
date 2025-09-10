import "src/assets/css/CampaignForm.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useDraftStore from "src/pages/draft/store";

import Progressbar from "src/components/Progressbar";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import EllipsisText from "react-ellipsis-text";

import Modal from "src/pages/draft/components/modals/Title";
import FormatDate from "src/components/FormatDate";

const DraftReview = () => {
  const [titleModal, setTitleModal] = useState("");
  const [descriptionModal, setDescriptionModal] = useState("");
  const [goalModal, setGoalModal] = useState("");
  const [imageModal, setImageModal] = useState("");
  const [dateModal, setDateModal] = useState(null);

  const [campaignId, setCampaignId] = useState("");
  const [title, setTitle] = useState("");
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

  const openTitleModal = () => {};

  const openDescriptionModal = () => {};

  const openImageModal = () => {};

  const openDateModal = () => {};

  const openGoalModal = () => {};

  const step = 5;
  const stepText = "Review your campaign details";
  const isButtonDisabled = !closeoutDate || isLoading;
  console.log(closeoutDate);
  return (
    <div className="flex w-full h-screen bg-[#f5f5f5]">
      {/* Left column */}
      <div className="hidden sm:block sm:w-1/2 md:w-2/5 lg:w-1/3 h-full">
        <div className="pt-45 px-10 md:px-20 lg:px-20">
          <div className="pb-4 mb-4 border-b-2 border-[#0fa347] transition-colors duration-300 font-light text-5xl">
            {stepText}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="w-full sm:w-1/2 md:w-3/5 lg:w-2/3 bg-white h-full shadow-lg flex flex-col justify-between rcorners">
        {/* Main content */}
        <div className=" sm:px-10 md:px-20 lg:px-30 pt-50  overflow-y-auto ">
          {/* Cover Image */}
          <div>
            <div className="flex justify-between my-3">
              <div className="font-semibold">Cover Image</div>
              <div>
                <div
                  onClick={openImageModal}
                  className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3] px-4 py-1 rounded-full cursor-pointer text-sm"
                >
                  edit
                </div>
              </div>
            </div>
            <img
              src={imageUrl}
              alt="ui/ux review check"
              className="rounded-lg h-100 w-full object-cover my-3"
            />
          </div>

          {/* Title */}
          <div className="flex justify-between my-6">
            <div>
              <div className="font-semibold">Title</div>
              <div className="my-3">{title}</div>
            </div>
            <div>
              <div
                onClick={openTitleModal}
                className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3] px-4 py-1 rounded-full cursor-pointer text-sm"
              >
                edit
              </div>
            </div>
          </div>
          <div className="border-b border-[#f5f1ed]" />

          {/* Description */}
          <div className="flex justify-between my-3">
            <div>
              <div className="font-semibold">Description</div>
              <div className="my-3">
                <EllipsisText text={description} length={"60"} />
              </div>
            </div>
            <div>
              <div
                onClick={openDescriptionModal}
                className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3] px-4 py-1 rounded-full cursor-pointer text-sm"
              >
                edit
              </div>
            </div>
          </div>
          <div className="border-b border-[#f5f1ed]" />

          {/* Goal */}
          <div className="flex justify-between my-3">
            <div>
              <div className="font-semibold">Goal</div>
              <div className="my-3">${goal}</div>
            </div>
            <div>
              <div
                onClick={openGoalModal}
                className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3] px-4 py-1 rounded-full cursor-pointer text-sm"
              >
                edit
              </div>
            </div>
          </div>
          <div className="border-b border-[#f5f1ed]" />

          {/* Closeout Date */}
          <div className="flex justify-between my-3">
            <div>
              <div className="font-semibold">Closeout Date</div>
              <div className="my-3">
                <FormatDate date={closeoutDate} />
              </div>
            </div>
            <div>
              <div
                onClick={openDateModal}
                className="border border-[#b7b7b6] hover:border-[#585858] hover:bg-[#f3f3f3] px-4 py-1 rounded-full cursor-pointer text-sm"
              >
                edit
              </div>
            </div>
          </div>
          <div className="border-b border-[#f5f1ed]" />
        </div>

        {/* Footer */}
        <footer className="w-full flex flex-col">
          <Progressbar progress={(6 / 6) * 100} />
          <div className="flex w-full p-10 justify-between items-center">
            {/* Back button */}
            <Link
              to={"/draft/date"}
              style={{ color: "black", fontSize: "15px" }}
            >
              <RiArrowLeftSLine size={40} />
            </Link>

            {/* Submit button */}
            {!isButtonDisabled ? (
              <Link to={"/admins/campaigns"}>
                <div className="font-medium text-base px-7 py-4 rounded-full text-white bg-[#0fa347] hover:bg-[#2bbd62] cursor-pointer">
                  SUBMIT
                </div>
              </Link>
            ) : (
              <div className="font-semibold text-base px-7 py-4 rounded-full bg-[#d8d8d8] text-slate-700 cursor-not-allowed">
                SUBMIT
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
export default DraftReview;
