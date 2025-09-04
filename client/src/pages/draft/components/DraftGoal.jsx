import RightPanel from "src/pages/draft/components/RightPanel.jsx";
import LeftPanel from "src/pages/draft/components/LeftPanel.jsx";

import "src/assets/css/CampaignForm.css";

import "src/assets/css/Modal.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "src/components/Loading";
import useCampaignStore from "src/pages/admin/campaigns/store.jsx";
import ImageUpload from "src/components/ImageUpload";
import ErrorAlert from "src/components/ErrorAlert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

const DraftGoal = () => {
  const [campaignId, setCampaignId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);

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
      if (!closeoutDate) {
        errors.push("Closeout Date is required.");
      }
      setErrors(errors);
      return;
    }
    shareCampaignDraft(campaignId, title, description, goal, closeoutDate.$d);
    navigate(-1);
    event.preventDefault();
  };

  const handleSave = (event) => {
    if (
      !title ||
      !description ||
      !goal ||
      goal <= 0.01 ||
      !imageUrl ||
      !closeoutDate
    ) {
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
      if (!closeoutDate) {
        errors.push("Closeout Date is required.");
      }
      setErrors(errors);
      return;
    }

    saveCampaign(campaignId, title, description, goal, closeoutDate.$d).then(
      (data) => {
        setTitle(data.title);
        setDescription(data.description);
        setGoal(data.goal);
      }
    );
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
  return (
    <div className="flex col w-full h-screen  bg-[#f5f5f5]">
      <div className="sm:w-50/100  md:w-40/100  lg:w-34/100  h-screen ">
        <LeftPanel step={step} text={stepText} />
      </div>
      <div class=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="sm:px-5 md:px-20 lg:px-35 pt-52 ">
          <form className="">
            <div className="p-2">
              <div className="min-w-75 text-lg  font-semibold w-full h-14 bg-transparent hover:bg-[#fafafa] placeholder:text-slate-400 text-slate-700 text-sm border border-[#b7b7b6] rounded-lg px-3 py-2 transition duration-300  focus:outline-none focus:border-[#232323] focus:border-2  ">
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
          </form>
        </div>
        <Footer handleSave={handleSave} />
      </div>
    </div>
  );
};
export default DraftGoal;
