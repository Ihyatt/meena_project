import React, { useState } from "react";
import useDonateStore from "src/pages/donation/store";
import { useNavigate } from "react-router-dom";

const useDonationForm = () => {
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
    if (!form.amount || form.amount < 5 || form.amount > 10000) {
      newErrors.push(
        "Amount must be greater than or equal to $5 and less than or equalt to $10,000.0"
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

  return {
    errors,
    customAmount,
    activeButton,
    form,
    handleChange,
    handleCustomAmount,
    handleClick,
    handleCheckboxChange,
    handleDonateClick,
    handleErrorClose,
    blockInvalidChar,
  };
};
export default useDonationForm;
