import React, { useCallback, useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useCampaignStore from '../stores/Campaign';
import './styles/Checkout.css'

const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
const stripePublishableKey = import.meta.env.VITE_STRIPE_PK;

const Checkout = () => {
  const { campaignId } = useCampaignStore();

  const stripePromise = loadStripe(stripePublishableKey)



    const fetchClientSecret = async () => {
      try {
        const response = await fetch(`${backendUrl}/campaigns/${campaignId}/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'email@example.com',
            firstName: '1.0',
            lastName: 'usd',
    
            metadata: {
              campaignId: campaignId,
            },
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!data.clientSecret) {
          throw new Error('No client secret in response');
        }
        return data.clientSecret; 
      } catch (error) {
        console.error('Error fetching client secret:', error);
        throw error;
      }
    };

  return (
    <div className="checkout-container" style={{ backgroundColor: 'black', minHeight: '100vh' }}>
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