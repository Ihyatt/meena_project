import "./index.css"
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// admin 
import Login from "src/pages/auth/Login";

import ProtectedRoute from "src/components/ProtectedRoute";
import DashboardLayout from "src/pages/admin/DashboardLayout";
import Dashboard from "src/pages/admin/Dashboard";

import { EmailTemplate } from "src/pages/admin/emailTemplate/Template";
import { CampaignDraft } from "src/pages/admin/draft/Draft";
import { CampaignDetails } from "src/pages/admin/campaigns/campaign/Edit";


// donor
import DonorLayout from "src/pages/donor/DonationLayout";
import Donation from "src/pages/donor/donation/Donation";
import Checkout from "src/pages/donor/donation/Checkout";
import CheckoutComplete from "src/pages/donor/donation/CheckoutComplete";


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
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<Dashboard />} path="/admins" />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {
        background && (
          <Routes>
            <Route path="/admins/campaigns/:campaignId" element={<CampaignDetails />} />
            <Route path="/admins/campaigns/drafts" element={<CampaignDraft />} />
            <Route path="/admins/emails/email-template/receipt" element={<EmailTemplate />} />
            <Route path="/admins/emails/email-template/impact" element={<EmailTemplate />} />
            <Route path="/admins/emails/email-template/closeout" element={<EmailTemplate />} />
          </Routes>
        )
      }
    </div >
  );
}

export default App;