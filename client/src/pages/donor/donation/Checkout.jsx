import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useDonorStore from 'src/stores/Donor';
import Loading from "src/components/Loading";


const stripePublishableKey = import.meta.env.VITE_STRIPE_PK;

const Checkout = () => {
  const { fetchClientSecret, isLoading } = useDonorStore();
  const stripePromise = loadStripe(stripePublishableKey)

  return (
    <div className="
      max-w-md
      mx-auto
      p-4
      border
      border-gray-300
      rounded-lg
      shadow-md
      bg-white
    ">
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