import "./index.css"
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// admin 
import Login from "src/pages/auth/Login";

import ProtectedRoute from "src/components/ProtectedRoute";
import DashboardLayout from "src/pages/admin/components/DashboardLayout";
import Dashboard from "src/pages/admin/Dashboard";

import { EmailTemplate } from "src/pages/admin/components/modals/EmailTemplate";
import { CampaignDraft } from "src/pages/admin/components/modals/CampaignDraft";
import { CampaignDetails } from "src/pages/admin/components/modals/EditCampaign";


// donor
import DonorLayout from "src/pages/donor/DonorLayout";
import Donation from "src/pages/donor/payment/Donation";
import Checkout from "src/pages/donor/payment/Checkout";
import CheckoutComplete from "src/pages/donor/payment/CheckoutComplete";

import Subscription from "src/pages/donor/payment/Subscription";
import SubscriptionCheckout from "src/pages/donor/payment/SubscriptionCheckout";
import ManageSubscription from "src/pages/donor/payment/ManageSubscription.js.jsx";

import ManagePreferences from "src/pages/donor/email/ManagePreferences";

import NotFound from "src/pages/NotFound";



function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <div >
      <Routes location={background || location}>
        <Route path="/login" element={<Login />} />
        <Route element={<DonorLayout />}>
          <Route path="/" element={<Donation />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout-complete" element={<CheckoutComplete />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="subscription-checkout" element={<SubscriptionCheckout />} />
          <Route path="manage-subscription" element={<ManageSubscription />} />
          <Route path="manage-preferences" element={<ManagePreferences />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
          path="/admins"
        >
          <Route index element={<Dashboard />} />
          <Route path="campaigns/:campaignId" element={<CampaignDetails />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/admins/campaigns/:campaignId" element={<CampaignDetails />} />
          <Route path="/admins/campaigns/drafts" element={<CampaignDraft />} />
          <Route path="/admins/emails/email-template/donation-receipt" element={<EmailTemplate />} />
          <Route path="/admins/emails/email-template/campaign-update" element={<EmailTemplate />} />
          <Route path="/admins/emails/email-template/campaign-close" element={<EmailTemplate />} />

        </Routes>
      )}
    </div>
  );
}

export default App;