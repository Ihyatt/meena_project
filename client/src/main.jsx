// External Stylesheets
import "./index.css";

// React and ReactDOM
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Local Component
import App from "./App";

// Environment Variables and Configuration
const stripePublishableKey = import.meta.env.VITE_STRIPE_PK;
const stripePromise = loadStripe(stripePublishableKey);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
