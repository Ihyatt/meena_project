import "src/assets/css/Modal.css";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import ImageUpload from "src/pages/admin/components/ImageUpload";
import ErrorAlert from "src/components/ErrorAlert";
import DonationCard from "src/pages/admin/donors/DonationCard";
import EmailSubscription from "src/pages/admin/donors/EmailSubscription";
import useCampaignStore from "src/pages/admin/campaigns/store";
import Loading from "src/components/Loading";
import Donations from "src/pages/admin/donors/Donations.jsx";

import useDonorStore from "src/pages/admin/donors/store";

export const ManageDonor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = location.state?.isModal;
  const modalRef = useRef();
  const { donorId } = useParams();

  const [errors, setErrors] = useState([]);

  const [donations, setDonations] = useState([]);
  const [emailSubscription, setEmailSubscription] = useState({});
  const [toggle, setToggle] = useState("donations");

  const {
    fetchDonor,
    manageDonorData,
    isLoading,
    fullName,
    setFullName,
    emailAddress,
    setEmailAddress,
    setEmailSubscriptionStatus,
    emailSubscriptionStatus,
  } = useDonorStore();

  useEffect(() => {
    fetchDonor(donorId).then((data) => {
      setDonations(data.donations);
      setFullName(data.fullName);
      setEmailAddress(data.emailAddress);
      setEmailSubscription(data.emailSubscription);
      setEmailSubscriptionStatus(data.emailSubscription.status);
    });
  }, [fetchDonor]);

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
      (!emailSubscriptionStatus != "ACTIVE" &&
        emailSubscriptionStatus != "INACTIVE")
    ) {
      const errors = [];
      if (!fullName) {
        errors.push("Full name is required.");
      }
      if (!emailAddress) {
        errors.push("Email address is required.");
      }
      if (!emailSubscriptionStatus) {
        errors.push("Email subscription status is required.");
      }
      if (
        !emailSubscriptionStatus != "ACTIVE" &&
        emailSubscriptionStatus != "INACTIVE"
      ) {
        errors.push(
          "Email subscription status should be either 'ACTIVE' or 'INACTIVE'."
        );
      }
      setErrors(errors);
      return;
    }
    manageDonorData(donorId).then((data) => {
      setDonations(data.donations);
      setFullName(data.fullName);
      setEmailAddress(data.emailAddress);
      setEmailSubscription(data.emailSubscription);
      setEmailSubscriptionStatus(data.emailSubscription.status);
    });
    event.preventDefault();
  };

  const handleErrorClose = () => {
    console.log("Error alert closed");
    setErrors([]);
  };

  const handleTableDisplay = (table) => () => {
    setToggle(table);
  };

  return (
    <div ref={modalRef} className="modal-wrapper">
      {isLoading && <Loading />}
      <div className="manage-donor-modal rounded-lg">
        <form className=" mx-auto p-5">
          <div className="flex ">
            <div className="p-2">
              <label class="block mb-2 text-sm text-slate-600">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
                required
              />
            </div>
            <div className="p-2">
              <label class="block mb-2 text-sm text-slate-600">
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                placeholder="Email Address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
              ></input>
            </div>
          </div>

          <div class="inline-flex pt-6 pl-3">
            <div
              className={`bg-gray-100 hover:bg-gray-200 text-gray-800  py-2 px-4 rounded-l text-sm ${toggle == "donations" ? "bg-gray-200 text-gray-800" : ""} `}
              onClick={handleTableDisplay("donations")}
            >
              Donations
            </div>
            <div
              className={`bg-gray-100 hover:bg-gray-200 text-gray-800  py-2 px-4 rounded-r text-sm ${toggle == "emailSubscription" ? "bg-gray-200 text-gray-800" : ""} `}
              onClick={handleTableDisplay("emailSubscription")}
            >
              Email Subscription
            </div>
          </div>
          {toggle == "donations" ? (
            <Donations donations={donations} />
          ) : (
            <EmailSubscription emailSubscription={emailSubscription} />
          )}

          <div className="flex  justify-end mt-4">
            <button
              type="button"
              className="
                h-6
                w-[110px]
                cursor-pointer
                bg-[rgb(234,237,241)]
                border-none
                text-[rgb(100,111,124)]
                rounded-full
                m-1.5
              "
              onClick={handleClose}
              disabled={isLoading}
            >
              Close
            </button>
            <button
              type="button"
              className="
                    m-1.5
                  h-6
                  w-[110px]
                  bg-[#40bf51]
                  text-white
                  border-none
                  cursor-pointer
                  rounded-full
                  font-medium
                "
              onClick={handleSave}
              disabled={isLoading}
            >
              Save
            </button>
          </div>
          {errors.length > 0 && (
            <ErrorAlert errors={errors} onClose={handleErrorClose} />
          )}
        </form>
      </div>
    </div>
  );
};
