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

const DraftDate = () => {
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
  console.log("here");
  return (
    <div className="flex col w-full h-screen  bg-red-500">
      <div className="w-1/3 h-screen "></div>
      <div class="w-2/3 rcorners bg-blue-500 h-screen "></div>
    </div>
  );
};
export default DraftDate;
