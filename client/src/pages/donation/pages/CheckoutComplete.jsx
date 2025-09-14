// 1. React
import React, { useEffect, useState } from "react";

// 2. React Router
import { useLocation, Link } from "react-router-dom";

// 3. Local Components
import Loading from "src/components/Loading";

// 4. State Management
import useDonateStore from "src/pages/donation/store";
import Failed from "src/pages/donation/components/Failed";
import Paid from "src/pages/donation/components/Paid";
import Unknown from "src/pages/donation/components/Unknown";

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
    <Paid>
      Success! Thank you for your donation.{" "}
      <Link
        to={"/"}
        style={{
          color: "black",
          fontSize: "15px",
          textDecoration: "underline",
        }}
      >
        Return to home page.
      </Link>
    </Paid>;
  } else if (status === "failed") {
    <Failed>
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
    </Failed>;
  } else {
    <Unknown>
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
    </Unknown>;
  }
};

export default CheckoutComplete;
