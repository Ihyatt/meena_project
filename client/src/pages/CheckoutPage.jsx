import React, { useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';



const backednUrl = import.meta.env.VITE_BACKEND_API_URL;
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;


const CheckoutPage = () => {
  const fetchClientSecret = useCallback(() => {
    return fetch(`${backednUrl}/campaigns/${camapignId}/create-checkout-session`, { 
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error.message);
        }
        return data.clientSecret;
      });
  }, []);

  const options = { fetchClientSecret };

  return (
    <div className="checkout-container" style={{maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
      <h2>Complete Your Donation</h2>
      <div id="checkout">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

export default CheckoutPage;