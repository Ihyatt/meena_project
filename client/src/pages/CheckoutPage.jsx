// frontend/src/pages/CheckoutPage.jsx
import React, { useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; // Load stripePromise here if not global

// Make sure to call `loadStripe` outside of a component’s render
// If you want to use this stripePromise only on this page, define it here
// Otherwise, it can remain global in index.js/main.jsx
const stripePromise = loadStripe("pk_test_51RYN7hBDf0C7MquBortrhWxvdIV8sGefWHua3uNVaCZimvSh2w1Fz4FiyhneOFEcjOA5A3OrOU8KItMRIP57uiYE00lho6BPUn");


const CheckoutPage = () => {
  const fetchClientSecret = useCallback(() => {
    // This function will fetch the client secret from your backend
    return fetch("http://localhost:5000/create-checkout-session", { // Ensure this URL is correct
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle potential errors from backend
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