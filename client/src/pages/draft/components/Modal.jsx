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
    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  return <div ref={modalRef} className="modal-wrapper"></div>;
};
export default ManageCampaign;
