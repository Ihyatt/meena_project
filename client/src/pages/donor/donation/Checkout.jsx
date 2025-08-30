import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "src/components/Loading";
import useDonateStore from "src/pages/donor/store";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PK;

const Checkout = () => {
  const { fetchClientSecret, isLoading } = useDonateStore();

  const stripePromise = loadStripe(stripePublishableKey);

  return (
    <div
      className="
      max-w-lg
      mx-auto
      p-4
      border
      border-gray-300
      rounded-lg
      shadow-md
      bg-white
      h-screen 
      w-full
    "
    >
      {isLoading && <Loading />}
      <div id="checkout">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

export default Checkout;
