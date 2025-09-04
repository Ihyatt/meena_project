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

const DraftCampaignImage = () => {
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
  const { fetchDraft, saveCampaign, shareCampaignDraft, upload, isLoading } =
    useCampaignStore();

  useEffect(() => {
    fetchDraft().then((data) => {
      setImageUrl(data.imageUrl);
    });
  }, [fetchCampaignDraft]);

  const handleClose = (event) => {
    navigate(-1);
    event.preventDefault();
  };

  const uploadFile = (file) => {
    upload(campaignId, file).then((data) => {
      setImageUrl(data.url);
      setFile(null);
    });
  };

  return (
    <div className="flex col w-full h-screen  bg-[#f5f5f5]">
      <div className="sm:w-50/100  md:w-40/100  lg:w-34/100  h-screen ">
        <LeftPanel step={step} text={stepText} />
      </div>
      <div class=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="sm:px-10 md:px-20 lg:px-30 pt-60 ">
          <ImageUpload
            campaignId={campaignId}
            imageUrl={imageUrl}
            uploadFile={uploadFile}
          />
        </div>
        <Footer handleSave={handleSave} />
      </div>
    </div>
  );
};
export default DraftCampaignImage;
