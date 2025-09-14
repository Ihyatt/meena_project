// React and hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Local components and state
import ErrorAlert from "src/components/ErrorAlert";
import useDonateStore from "src/pages/donation/store";

import TermsOfService from "src/pages/donation/components/DonationForm/TermsOfService";
import CheckBox from "src/pages/donation/components/DonationForm/CheckBox";
import CustomAmount from "src/pages/donation/components/DonationForm/CustomAmount";
import EmailAddress from "src/components/EmailAddress";
import FullName from "src/components/FullName";
import AmountButton from "src/pages/donation/components/DonationForm/AmountButton";
import DonateButton from "src/pages/donation/components/DonationForm/DonateButton";

const DonationForm = ({ targetRef }) => {
  const navigate = useNavigate();
  const { createPaymentIntent, setPaymentIntentId } = useDonateStore();

  const [errors, setErrors] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const [activeButton, setActiveButton] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    emailAddress: "",
    amount: "",
    isAnonymous: false,
    isEmailSubscription: false,
  });

  const handleClick = (buttonId, amount) => {
    console.log(amount, buttonId);
    setActiveButton(buttonId);
    setForm({
      ...form,
      amount: amount,
    });
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const amountValue = parseFloat(cleanedValue);
    setForm({
      ...form,
      amount: amountValue,
    });
    setCustomAmount(cleanedValue);
    setActiveButton("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleDonateClick = (event) => {
    event.preventDefault();
    const newErrors = [];
    if (!form.fullName) {
      newErrors.push("Full name is required");
    }
    if (!form.emailAddress) {
      newErrors.push("Email address is required");
    }
    if (!form.amount || form.amount <= 0.01 || form.amount >= 100000.01) {
      newErrors.push(
        "Amount must be greater than $0.01 and less than $1,000.01"
      );
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      setErrors([]); // Clear any existing errors

      createPaymentIntent({
        ...form,
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

  console.log(form);
  return (
    <div className="p-10 md:p-20 lg:p-20 bg-white rounded-lg shadow-lg mt-6 w-full lg:w-7/8 ">
      <div className="text-2xl font-bold">Select Gift Amount</div>
      <div className="mb-3 text-gray-400 text-xs">_ _ _</div>
      <form onSubmit={handleDonateClick}>
        <div>One-time donation</div>
        <div
          className="flex gap-5 my-[25px] transition-all duration-300 ease-in-out"
          id="amountSelector"
        >
          <AmountButton
            activeButton={activeButton}
            amount={15}
            buttonId={"button1"}
            handleClick={handleClick}
          />
          <AmountButton
            activeButton={activeButton}
            amount={30}
            buttonId={"button2"}
            handleClick={handleClick}
          />
          <AmountButton
            activeButton={activeButton}
            amount={100}
            buttonId={"button3"}
            handleClick={handleClick}
          />
          <AmountButton
            activeButton={activeButton}
            amount={500}
            buttonId={"button4"}
            handleClick={handleClick}
          />
        </div>

        <div className="flex flex-col">
          <CustomAmount
            amount={customAmount}
            setAmount={handleCustomAmount}
            blockInvalidChar={blockInvalidChar}
          />

          <EmailAddress handleChange={handleChange} />

          <FullName handleChange={handleChange} />
        </div>
        <CheckBox
          name={"isAnonymous"}
          checked={form.isAnonymous}
          handleCheckboxChange={handleCheckboxChange}
          message={
            <>
              <span className="font-bold">yes,</span> I would like my donation
              to be anonymous
            </>
          }
        />
        <CheckBox
          name={"isEmailSubscription"}
          checked={form.isEmailSubscription}
          handleCheckboxChange={handleCheckboxChange}
          message={
            <>
              <span className="font-bold">yes,</span> I would like to receive
              email updates
            </>
          }
        />

        <div ref={targetRef}>
          <DonateButton />
        </div>
        <TermsOfService />
        {errors.length > 0 && (
          <ErrorAlert errors={errors} onClose={handleErrorClose} />
        )}
      </form>
    </div>
  );
};
export default DonationForm;
