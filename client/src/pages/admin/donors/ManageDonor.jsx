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
  console.log("managedonor", donorId);

  const [errors, setErrors] = useState([]);

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [donations, setDonations] = useState([]);
  const [isEmailSubscription, setIsEmailSubscription] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState({});
  const [toggle, setToggle] = useState("donations");

  const { fetchDonor, isLoading } = useDonorStore();

  useEffect(() => {
    console.log("fetching donor 1", donorId);
    fetchDonor(donorId).then((data) => {
      setFullName(data.fullName);
      setEmailAddress(data.emailAddress);
      setDonations(data.donations);
      setEmailSubscription(data.emailSubscription);
      const dataIsEmailSubscription =
        data.emailSubscription.status === "ACTIVE";
      setIsEmailSubscription(dataIsEmailSubscription);
      console.log("hi", data);
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
    return;
    event.preventDefault();
  };

  const handleSubscriptionChange = () => {
    const IsEmailSubscription = !IsEmailSubscription;
    setIsEmailSubscription(IsEmailSubscription);
  };

  const handleErrorClose = () => {
    console.log("Error alert closed");
    setErrors([]);
  };
  console.log(toggle);

  const handleTableDisplay = (table) => () => {
    setToggle(table);
  };

  return (
    <div ref={modalRef} className="modal-wrapper">
      {isLoading && <Loading />}
      <div className="modal rounded-lg">
        <form className="max-w-xl mx-auto p-5">
          <div className="p-2">
            <label class="block mb-2 text-sm text-slate-600">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
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
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
            ></input>
          </div>
          <div className="p-2">
            <label className="flex items-center cursor-pointer relative mr-1">
              <input
                type="checkbox"
                checked={isEmailSubscription}
                onChange={handleSubscriptionChange}
                className="
                    peer 
                    h-3.5 
                    w-3.5 
                    cursor-pointer 
                    transition-all 
                    appearance-none 
                    rounded 
                    hover:shadow-sm 
                    border 
                    border-slate-300 
                    checked:bg-slate-800 
                    checked:border-slate-800
                  "
                id="check-custom-icon"
              />
              <span
                className="
                    absolute
                    text-white
                    opacity-0
                    peer-checked:opacity-100
                    top-1/2
                    left-1/2
                    transform
                    -translate-x-1/2
                    -translate-y-1/2
                  "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </label>
          </div>
          <div>
            <div></div>
          </div>

          <div class="inline-flex">
            <div
              class="bg-gray-300 hover:bg-gray-400 text-gray-800  py-2 px-4 rounded-l text-sm"
              onClick={handleTableDisplay("donations")}
            >
              Donations
            </div>
            <div
              class="bg-gray-300 hover:bg-gray-400 text-gray-800  py-2 px-4 rounded-r text-sm"
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

          {errors.length > 0 && (
            <ErrorAlert errors={errors} onClose={handleErrorClose} />
          )}
        </form>
      </div>
    </div>
  );
};
