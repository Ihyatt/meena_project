import "src/assets/css/Modal.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "src/components/Loading";
import useCampaignStore from "src/pages/admin/campaigns/store.jsx";
import ImageUpload from "src/pages/admin/components/ImageUpload";
import useAuthStore from "src/pages/auth/store";
import ErrorAlert from "src/components/ErrorAlert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

export const CampaignDraft = () => {
  const [campaignId, setCampaignId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [closeoutDate, setCloseoutDate] = useState(null);

  const descriptioncharactersLimit = 2000;
  const titlecharactersLimit = 100;

  const modalRef = useRef();
  const navigate = useNavigate();
  const {
    fetchCampaignDraft,
    saveCampaign,
    shareCampaignDraft,
    upload,
    isLoading,
  } = useCampaignStore();

  useEffect(() => {
    fetchCampaignDraft().then((data) => {
      setCampaignId(data.id);
      setTitle(data.title);
      setDescription(data.description);
      setGoal(data.goal || "");
      setImageUrl(data.imageUrl);
    });
  }, [fetchCampaignDraft]);

  useEffect(() => {
    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  const handleClose = (event) => {
    navigate(-1);
    event.preventDefault();
  };

  const handleShare = (event) => {
    if (!title || !description || !goal || !imageUrl) {
      const errors = [];
      if (!title) {
        errors.push("Title is required.");
      }
      if (!description) {
        errors.push("Description is required.");
      }
      if (goal <= 0) {
        errors.push("Goal must be greater than 0.");
      }
      if (!imageUrl) {
        errors.push("Image is required.");
      }
      setErrors(errors);
      return;
    }
    shareCampaignDraft(campaignId, title, description, goal);
    navigate(-1);
    event.preventDefault();
  };

  const handleSave = (event) => {
    if (!title || !description || !goal || goal <= 0.01 || !imageUrl) {
      const errors = [];
      if (!title) {
        errors.push("Title is required.");
      }
      if (!description) {
        errors.push("Description is required.");
      }
      if (goal <= 0) {
        errors.push("Goal must be greater than 0.01.");
      }
      if (!imageUrl) {
        errors.push("Image is required.");
      }
      setErrors(errors);
      return;
    }

    saveCampaign(campaignId, title, description, goal).then((data) => {
      setTitle(data.title);
      setDescription(data.description);
      setGoal(data.goal);
    });
    event.preventDefault();
  };

  const handleGoalAmount = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const amountValue = parseFloat(cleanedValue);
    setGoal(amountValue);
  };

  const uploadFile = (file) => {
    upload(campaignId, file).then((data) => {
      setImageUrl(data.url);
      setFile(null);
    });
  };
  const handleDateChange = (newDate) => {
    setCloseoutDate(newDate);
    // You can now use the newDate variable here
    console.log(newDate); // This will log the selected date object
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= titlecharactersLimit) {
      setTitle(value);
    } else {
      window.alert(`Title cannot exceed ${titlecharactersLimit} characters.`);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= descriptioncharactersLimit) {
      setDescription(value);
    } else {
      window.alert(
        `Description cannot exceed ${descriptioncharactersLimit} characters.`
      );
    }
  };

  const handleErrorClose = () => {
    setErrors([]);
  };
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  console.log("here");
  return (
    <div ref={modalRef} className="modal-wrapper">
      {isLoading && <Loading />}
      <div className="modal rounded-lg">
        <form className="max-w-xl mx-auto p-5">
          <div className="p-2">
            <label className="block mb-2 text-2xl text-slate-600">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
              required
            />
          </div>
          <div className="p-2">
            <label className="block mb-2  text-2xl text-slate-600">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description..."
              value={description}
              onChange={handleDescriptionChange}
              rows="4"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
            ></textarea>
          </div>
          <div className="p-2">
            <label className="block mb-2  text-2xl text-slate-600">
              Closeout Date
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                orientation="landscape"
                // Pass the handleDateChange function to the onChange prop
                onChange={handleDateChange}
                // Optionally, pass the closeoutDate to the value prop to control the component
                value={closeoutDate}
              />
            </LocalizationProvider>
          </div>
          <div className="p-2">
            <div className=" w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow   flex items-center justify-between mb-3">
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
          </div>
          <ImageUpload
            campaignId={campaignId}
            imageUrl={imageUrl}
            uploadFile={uploadFile}
          />
          <div className="flex items-center mt-8 justify-between">
            <button
              type="button"
              className="text-white bg-gray-400 focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-gray-300 "
              onClick={handleClose}
              disabled={isLoading}
            >
              Close
            </button>
            <div>
              <button
                type="button"
                className="text-white bg-[#0fa347]  focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-[#2bbd62] "
                onClick={handleSave}
                disabled={isLoading}
              >
                Save
              </button>

              <button
                type="button"
                className="text-white bg-[#0fa347]  focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-[#2bbd62] "
                onClick={handleShare}
                disabled={isLoading}
              >
                Share
              </button>
            </div>
          </div>
          {errors.length > 0 && (
            <ErrorAlert errors={errors} onClose={handleErrorClose} />
          )}
        </form>
      </div>
    </div>
  );
};
