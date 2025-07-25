import "./index.css"
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Donate from "src/pages/donor/Donate";
import Checkout from "src/pages/donor/Checkout";
import CheckoutComplete from "src/pages/donor/CheckoutComplete";
import Login from "src/pages/auth/Login";
import Dashboard from "src/pages/admin/Dashboard";
import { EmailTemplate } from "src/pages/admin/components/modals/EmailTemplate";
import { CampaignDraft } from "src/pages/admin/components/modals/CampaignDraft";
import { CampaignDetails } from "src/pages/admin/components/modals/EditCampaign";
import DashboardLayout from "src/pages/admin/components/DashboardLayout";
import NotFound from "src/pages/NotFound";
import Unsubscribe from "src/pages/Unsubscribe";
import ProtectedRoute from "src/components/ProtectedRoute";



function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <div >
      <Routes location={background || location}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Donate />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout-complete" element={<CheckoutComplete />} />
        <Route path="unsubscribe" element={<Unsubscribe />} />

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