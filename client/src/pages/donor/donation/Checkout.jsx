// Stripe imports
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Local components
import Loading from "src/components/Loading";

// State management
import useDonateStore from "src/pages/donor/store";

// Environment variables
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
