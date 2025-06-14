import React, { useCallback, useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useCampaignStore from '../stores/Campaign';

const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
const stripePublishableKey = import.meta.env.VITE_STRIPE_PK;

const Checkout = () => {
  const { campaignId } = useCampaignStore();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Stripe only once
  useEffect(() => {
    if (!stripePublishableKey) {
      setError('Stripe publishable key is missing');
      setLoading(false);
      return;
    }

    const initializeStripe = async () => {
      try {
        const stripe = await loadStripe(stripePublishableKey);
        setStripePromise(stripe);
      } catch (err) {
        console.error('Failed to load Stripe:', err);
        setError('Failed to initialize payment processor');
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  // Fetch client secret when campaignId is available
  useEffect(() => {
    if (!campaignId || !stripePromise) return;

    const fetchSecret = async () => {
      try {
        const response = await fetch(`${backendUrl}/campaigns/${campaignId}/create-checkout-session`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to create checkout session');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Checkout session error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSecret();
  }, [campaignId, stripePromise]);

  if (loading) {
    return <div>Loading payment processor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!clientSecret) {
    return <div>Preparing checkout...</div>;
  }

  return (
    <div className="checkout-container">
      <h2>Complete Your Donation</h2>
      <div id="checkout">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

export default Checkout;