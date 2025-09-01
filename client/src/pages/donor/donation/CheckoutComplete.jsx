import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Loading from "src/components/Loading";
import useDonateStore from "src/pages/donor/store";

const CheckoutComplete = () => {
  const { fetchCheckout, isLoading, status } = useDonateStore();

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    fetchCheckout(sessionId);
  }, [fetchCheckout]);

  {
    isLoading && <Loading />;
  }
  if (status == "paid") {
    return <div> Success! Thank you for your donation</div>;
  } else if (status === "failed") {
    <div>
      {" "}
      Your payment has failed. Please try again later or contact Stripe.com
    </div>;
  }

  return <div>Something went wrong.</div>;
};

export default CheckoutComplete;
