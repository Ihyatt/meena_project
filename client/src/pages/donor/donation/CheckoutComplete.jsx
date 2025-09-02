// 1. React
import React, { useEffect, useState } from "react";

// 2. React Router
import { useLocation, Link } from "react-router-dom";

// 3. Local Components
import Loading from "src/components/Loading";

// 4. State Management
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
    return (
      <div>
        {" "}
        Success! Thank you for your donation.{" "}
        <Link
          to={"/"}
          style={{
            color: "black",
            fontSize: "15px",
            textDecoration: "underline",
          }}
        >
          {" "}
          Return to home page.
        </Link>
      </div>
    );
  } else if (status === "failed") {
    <div>
      {" "}
      Your payment has failed. Please try again later or contact Stripe.com{" "}
      <Link
        to={"/"}
        style={{
          color: "black",
          fontSize: "15px",
          textDecoration: "underline",
        }}
      >
        {" "}
        Return to home page.
      </Link>
    </div>;
  }

  return (
    <div>
      Something went wrong.{" "}
      <Link
        to={"/"}
        style={{
          color: "black",
          fontSize: "15px",
          textDecoration: "underline",
        }}
      >
        {" "}
        Return to home page.
      </Link>
    </div>
  );
};

export default CheckoutComplete;
