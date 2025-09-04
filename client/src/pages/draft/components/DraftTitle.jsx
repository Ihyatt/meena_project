import RightPanel from "src/pages/draft/components/RightPanel.jsx";
import LeftPanel from "src/pages/draft/components/LeftPanel.jsx";
import Footer from "src/pages/draft/components/Footer.jsx";
import React, { useEffect, useState } from "react";

import "src/assets/css/Modal.css";

import { useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "src/components/Loading";
import useDraftStore from "src/pages/draft/store";
import ImageUpload from "src/components/ImageUpload";
import ErrorAlert from "src/components/ErrorAlert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

import "src/assets/css/CampaignForm.css";

const DraftTitle = () => {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState([]);
  const titlecharactersLimit = 100;

  const { fetchDraft, saveDraft, isLoading } = useDraftStore();

  useEffect(() => {
    fetchDraft().then((data) => {
      setTitle(data.title);
    });
  }, [fetchDraft]);

  const handleSave = (event) => {
    if (!title) {
      const errors = [];
      if (!title) {
        errors.push("Title is required.");
      }
      setErrors(errors);
      return;
    }
    saveDraft({ title: title }).then((data) => {
      setTitle(data.title);
    });
    event.preventDefault();
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= titlecharactersLimit) {
      setTitle(value);
    } else {
      window.alert(`Title cannot exceed ${titlecharactersLimit} characters.`);
    }
  };
  const step = 1;
  const stepText = "Give your campaign a title";
  return (
    <div className="flex col w-full h-screen  bg-[#f5f5f5]">
      <div className="sm:w-50/100  md:w-40/100  lg:w-34/100  h-screen ">
        <LeftPanel step={step} text={stepText} />
      </div>
      <div class=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="sm:px-5 md:px-20 lg:px-35 pt-52 ">
          <form className="">
            <div className="p-2">
              <div className="min-w-75 text-lg font-semibold w-full h-14 bg-transparent hover:bg-[#fafafa] placeholder:text-slate-400 text-slate-700  border border-[#b7b7b6] rounded-lg px-3 py-2 transition duration-300  focus:outline-none focus-within:border-[#232323] focus-within:border-2 flex justify-between items-center ">
                <input
                  type="text"
                  id="title"
                  placeholder="Give your campaign a title"
                  value={title}
                  onChange={handleTitleChange}
                  className="border-none w-full  focus:outline-none "
                />
                <div className=" ml-2">
                  {titlecharactersLimit - title.length}
                </div>
              </div>
            </div>
          </form>
        </div>
        <Footer handleSave={handleSave} progress={(1 / 6) * 100} />
      </div>
    </div>
  );
};
export default DraftTitle;
