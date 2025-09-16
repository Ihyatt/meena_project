// External Stylesheets

// State Management
import useDonorStore from "src/pages/admin/donors/store";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const useDonor = () => {
  const [errors, setErrors] = useState([]);

  const [donations, setDonations] = useState([]);
  const [emailSubscription, setEmailSubscription] = useState({});
  const [toggle, setToggle] = useState("donations");
  const [fullName, setFullName] = useState("");
  const [emailSubscriptionStatus, setEmailSubscriptionStatus] = useState("");
  const { fetchDonor, manageDonorData, isLoading } = useDonorStore();
  const [emailAddress, setEmailAddress] = useState("");
  const { donorId } = useParams();

  useEffect(() => {
    fetchDonor(donorId).then((data) => {
      setEmailAddress(data.emailAddress);
      setFullName(data.fullName);
      setDonations(data.donations);
      setEmailSubscription(data.emailSubscription);
    });
  }, []);
  const navigate = useNavigate();

  const handleClose = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  const handleSave = (event) => {
    event.preventDefault();

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
    donorId,
    errors,
    donations,
    emailSubscription,
    toggle,
    fullName,
    emailSubscriptionStatus,
    emailAddress,
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
