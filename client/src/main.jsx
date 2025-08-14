import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PK;
const stripePromise = loadStripe(stripePublishableKey)


ReactDOM.createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);