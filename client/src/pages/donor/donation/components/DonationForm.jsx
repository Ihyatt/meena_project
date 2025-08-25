import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDonorStore from "src/pages/donor/store";
import { RiInstagramLine } from "react-icons/ri";

const DonationForm = ({ targetRef }) => {
  const [customAmount, setCustomAmount] = useState("");
  const navigate = useNavigate();

  const {
    fullName,
    setFullName,
    setAmount,
    emailAddress,
    setEmailAddress,
    setIsAnonymous,
    isAnonymous,
    setIsEmailSubscription,
    isEmailSubscription,
    activeButton,
    setActiveButton,
  } = useDonorStore();

  const handleClick = (buttonId, amount) => {
    setActiveButton(buttonId);
    setAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    setAmount(e.target.value);
    setCustomAmount(e.target.value);
    setActiveButton("");
  };

  const handleDonateClick = () => {
    navigate(`/checkout`);
  };

  return (
    <div className="p-15 bg-white rounded-sm shadow-lg mt-6 w-7/8">
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
          <input
            required
            type="number"
            id="number"
            value={customAmount}
            onChange={handleCustomAmount}
            placeholder="$ Custom Amount"
            className="border border-gray-400 rounded-sm w-3/4 p-2 mb-2 focus:outline-none"
          />
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
          <div className="m-2 text-sm text-gray-400 font-light">
            <div className="inline-flex items-center mr-1">
              <label className="flex items-center cursor-pointer relative mr-1">
                <input
                  checked={isEmailSubscription}
                  onChange={setIsEmailSubscription}
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
              <label>I would like to receive email updates</label>
            </div>

            <div className="inline-flex items-center mr-1">
              <label className="flex items-center cursor-pointer relative mr-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={setIsAnonymous}
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
              <label>I would like my donation to be anonymous</label>
            </div>
          </div>
        </div>

        <div className="my-6" ref={targetRef}>
          <input
            className="
            font-medium 
            text-base 
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
          <a
            href="https://www.instagram.com/themeenaproject/"
            className="
            font-light 
            text-gray-400 
            inline-flex 
            items-center 
            vertical-align-middle 
            hover:text-gray-500"
          >
            Follow Meena on Instagram <RiInstagramLine />
          </a>
        </div>
      </form>
    </div>
  );
};
export default DonationForm;
