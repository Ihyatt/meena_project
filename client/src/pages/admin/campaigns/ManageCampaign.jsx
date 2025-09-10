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
  return <div> manage campaign</div>;
};
export default ManageCampaign;
