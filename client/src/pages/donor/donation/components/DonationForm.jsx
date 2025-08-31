import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiInstagramLine } from "react-icons/ri";
import ErrorAlert from "src/components/ErrorAlert";
import { Link, useLocation } from "react-router-dom";
import useDonateStore from "src/pages/donor/store";

const DonationForm = ({ targetRef }) => {
  const [customAmount, setCustomAmount] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEmailSubscription, setIsEmailSubscription] = useState(false);
  const {
    fetchClientSecret,
    isLoading,
    createPaymentIntent,
    setPaymentIntentId,
  } = useDonateStore();

  const handleClick = (buttonId, amount) => {
    setActiveButton(buttonId);
    setAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const amountValue = parseFloat(cleanedValue);
    setAmount(amountValue);
    setCustomAmount(cleanedValue);
    setActiveButton("");
  };

  const handleDonateClick = (event) => {
    // Always prevent default form submission first
    event.preventDefault();

    // Create a new array to hold the errors
    const newErrors = [];

    if (!fullName) {
      newErrors.push("Full name is required");
    }
    if (!emailAddress) {
      newErrors.push("Email address is required");
    }
    if (!amount || amount <= 0.01 || amount >= 100000.01) {
      console.log(amount);
      newErrors.push(
        "Amount must be greater than $0.01 and less than $1,000.01"
      );
    }

    // Set the state with the new array of errors
    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      // If there are no errors, proceed with navigation
      setErrors([]); // Clear any existing errors

      createPaymentIntent({
        fullName,
        emailAddress,
        amount,
        isEmailSubscription,
        isAnonymous,
      }).then((data) => {
        setPaymentIntentId(data.paymentIntentId);
        navigate("/checkout");
      });
    }
  };

  const handleErrorClose = () => {
    setErrors([]);
  };
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  return (
    <div className="p-20 bg-white rounded-xl shadow-lg mt-6 w-7/8">
      <div className="text-2xl font-bold">Select Gift Amount</div>
      <div className="mb-3 text-gray-400 text-xs">_ _ _</div>
      <form onSubmit={handleDonateClick}>
        <div>One-time donation</div>
        <div
          className="flex gap-5 my-[25px] transition-all duration-300 ease-in-out"
          id="amountSelector"
        >
          {[15, 30, 100, 500].map((amount, index) => (
            <button
              key={index}
              type="button"
              className={`
                font-medium 
                text-base 
                flex-1 
                p-2 
                border 
                border-[#cecfdb] 
                rounded 
                text-gray-800 
                cursor-pointer
              ${
                activeButton === `button${index + 1}`
                  ? "bg-[#0fa347] text-white border-none hover:bg-[#2bbd62] transition-colors duration-300"
                  : ""
              }
            `}
              onClick={() => handleClick(`button${index + 1}`, amount)}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          <div className=" border border-gray-400  p-2 rounded-sm  flex items-center justify-between mb-3">
            <div className="flex flex-col text-xs items-center">
              <div>$</div>
              <div>USD</div>
            </div>
            <div className="text-2xl">
              <input
                type="number"
                pattern="[0-9]"
                title="only numbers"
                value={customAmount}
                onChange={handleCustomAmount}
                onKeyDown={blockInvalidChar}
                className="border-none rounded-sm focus:outline-none text-right"
              />
              <span className="">.00</span>
            </div>
          </div>
          <input
            required
            type="email"
            id="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Email"
            className="border-b border-gray-400 w-3/4 p-2 mb-2 focus:outline-none"
          />
          <input
            required
            type="text"
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Name"
            className="border-b border-gray-400 w-3/4 p-2 mb-2 focus:outline-none"
          />
        </div>

        <div className="mt-4 mb-5">
          <div className="m-2 text-gray-400 font-light">
            <div className="inline-flex items-center text-sm mr-1">
              <label className="flex items-center cursor-pointer relative mr-2">
                <input
                  checked={isEmailSubscription}
                  onChange={() => setIsEmailSubscription(!isEmailSubscription)}
                  type="checkbox"
                  className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                  id="check-custom-icon"
                />
                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
              <label>
                <span className="font-bold">yes,</span> I would like to receive
                email updates
              </label>
            </div>

            <div className="inline-flex items-center mr-1 text-sm">
              <label className="flex items-center cursor-pointer relative mr-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
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
              <label>
                <span className="font-bold">yes,</span> I would like my donation
                to be anonymous
              </label>
            </div>
          </div>
        </div>

        <div className="my-6" ref={targetRef}>
          <input
            className="
            text-xl
            w-full 
            p-[15px] 
            bg-[#0fa347] 
            text-white 
            rounded 
            cursor-pointer
            transition-colors
            duration-300 
            block
            mx-auto 
            hover:bg-[#2bbd62]
            
            "
            type="submit"
            value="Donate"
          />
        </div>
        <div className="mb-4">
          <div
            className="text-sm font-light 
            text-gray-400 
            inline-flex 
            items-center 
            vertical-align-middle 
            cursor-pointer
            "
          >
            <span> By clicking ‘Donate‘, you agree to Meena Projects’s</span>
            <Link to={"terms"} className="ml-1 underline hover:no-underline">
              Terms of Service
            </Link>
            .
          </div>
        </div>
        {errors.length > 0 && (
          <ErrorAlert errors={errors} onClose={handleErrorClose} />
        )}
      </form>
    </div>
  );
};
export default DonationForm;
