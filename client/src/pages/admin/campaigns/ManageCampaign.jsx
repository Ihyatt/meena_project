// External Stylesheets
import "src/assets/css/Modal.css";

// React Hooks and Router
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// External Libraries
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

// Local Components
import ImageUpload from "src/components/ImageUpload";
import ErrorAlert from "src/components/ErrorAlert";
import Loading from "src/components/Loading";

// import Title from "src/pages/admin/campaigns/components/Title";
// import Description from "src/pages/admin/campaigns/components/Description";
// import CloseoutDate from "src/pages/admin/campaigns/components/CloseoutDate";
// import Goal from "src/pages/admin/campaigns/components/Goal";
// import CoverImage from "src/pages/admin/campaigns/components/CoverImage";

// State Management
import useCampaignStore from "src/pages/admin/campaigns/store";

export const ManageCampaign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = location.state?.isModal;
  const modalRef = useRef();
  const { campaignId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [closeoutDate, setCloseoutDate] = useState(null);

  const { fetchCampaign, saveCampaign, isLoading, upload } = useCampaignStore();

  useEffect(() => {
    fetchCampaign(campaignId).then((data) => {
      setTitle(data.title);
      setDescription(data.description);
      setGoal(data.goal);
      setImageUrl(data.imageUrl);
    });
  }, [fetchCampaign]);

  useEffect(() => {
    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 6;

  const page = useMemo(() => {
    const startIndex = 0;
    const endIndex = 5;
  }, [currentPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleClose = (event) => {
    event.preventDefault();
    navigate(-1);
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

  const descriptioncharactersLimit = 2000;
  const titlecharactersLimit = 100;

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= titlecharactersLimit) {
      setTitle(value);
    } else {
      window.alert(`Title cannot exceed ${titlecharactersLimit} characters.`);
    }
  };
  const handleDateChange = (newDate) => {
    setCloseoutDate(newDate);
    // You can now use the newDate variable here
    console.log(newDate); // This will log the selected date object
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
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

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

  const handleErrorClose = () => {
    setErrors([]);
  };

  return <div ref={modalRef} className="modal-wrapper"></div>;
};
export default ManageCampaign;
