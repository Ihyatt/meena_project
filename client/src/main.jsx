// frontend/src/index.js (or main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Keep BrowserRouter here or in App.jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'; // Use Elements if you plan PaymentElement later

import App from './App';

// Make sure to call `loadStripe` outside of a component’s render
const stripePromise = loadStripe("pk_test_51RYN7hBDf0C7MquBortrhWxvdIV8sGefWHua3uNVaCZimvSh2w1Fz4FiyhneOFEcjOA5A3OrOU8KItMRIP57uiYE00lho6BPUn");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Elements provider can wrap the entire app if all pages might use Stripe */}
    {/* For EmbeddedCheckoutProvider, you'll put it within the specific page component */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);