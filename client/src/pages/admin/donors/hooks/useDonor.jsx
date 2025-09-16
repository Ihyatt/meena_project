// External Stylesheets
import "src/assets/css/Modal.css";

// React Hooks and Router
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// External Libraries
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

// State Management
import useDonorStore from "src/pages/admin/donors/store";
import { set } from "date-fns";

const useDonor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = location.state?.isModal;
  const modalRef = useRef();
  const { donorId } = useParams();

  const [errors, setErrors] = useState([]);

  const [donations, setDonations] = useState([]);
  const [emailSubscription, setEmailSubscription] = useState({});
  const [toggle, setToggle] = useState("donations");
  const [fullName, setFullName] = useState("");
  const [emailSubscriptionStatus, setEmailSubscriptionStatus] = useState("");
  const { fetchDonor, manageDonorData, isLoading } = useDonorStore();
  const [emailAddress, setEmailAddress] = useState("");

  useEffect(() => {
    fetchDonor(donorId).then((data) => {
      setEmailAddress(data.emailAddress);
      setFullName(data.fullName);
      setDonations(data.donations);
      setEmailSubscription(data.emailSubscription);
    });
  }, []);

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

  const handleSave = (event) => {
    if (
      !fullName ||
      !emailAddress ||
      !emailSubscriptionStatus ||
      (emailSubscriptionStatus != "active" &&
        emailSubscriptionStatus != "inactive")
    ) {
      const errors = [];
      if (!fullName) {
        errors.push("Full name is required.");
      }
      if (!emailSubscriptionStatus) {
        errors.push("Email subscription status is required.");
      }
      if (
        emailSubscriptionStatus != "active" &&
        emailSubscriptionStatus != "inactive"
      ) {
        errors.push(
          "Email subscription status should be either 'active' or 'inactive'."
        );
      }

      setErrors(errors);
      return;
    }
    manageDonorData(
      donorId,
      emailAddress,
      fullName,
      emailSubscriptionStatus
    ).then((data) => {
      setEmailAddress(data.emailAddress);
      setFullName(data.fullName);
      setDonations(data.donations);
      setEmailSubscription(data.emailSubscription);
    });
    event.preventDefault();
  };

  const handleErrorClose = () => {
    setErrors([]);
  };

  const handleTableDisplay = (table) => () => {
    setToggle(table);
  };
  const handleSubscriptionChange = (status) => {
    setEmailSubscriptionStatus(status);
  };
  return {
    location,
    navigate,
    isModal,
    modalRef,
    donorId,
    errors,
    donations,
    emailSubscription,
    toggle,
    fullName,
    emailSubscriptionStatus,
    emailAddress,
    donorData,
    isLoading,
    setFullName,
    setEmailAddress,
    handleClose,
    handleSave,
    handleErrorClose,
    handleTableDisplay,
    handleSubscriptionChange,
  };
};
export default useDonor;
