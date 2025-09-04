// External Stylesheets
import "./index.css";

// React and Router
import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Shared Components
import ProtectedRoute from "src/components/ProtectedRoute";
import NotFound from "src/pages/NotFound";

// Admin Pages
import Login from "src/pages/auth/Login";
import DashboardLayout from "src/pages/admin/DashboardLayout";
import Dashboard from "src/pages/admin/Dashboard";
import Campaigns from "src/pages/admin/campaigns/Campaigns";
import Donors from "src/pages/admin/donors/Donors";
import { EmailTemplate } from "src/pages/admin/emailTemplate/Template";
import { ManageDonor } from "src/pages/admin/donors/ManageDonor";

//Admin Capaign Pages
import DraftLayout from "src/pages/draft/DraftLayout";
import DraftTitle from "src/pages/draft/components/DraftTitle";
import DraftDescription from "src/pages/draft/components/DraftDescription";
import DraftGoal from "src/pages/draft/components/DraftGoal";
import DraftImage from "src/pages/draft/components/DraftImage";
import DraftDate from "src/pages/draft/components/DraftDate";
import DraftReview from "src/pages/draft/components/DraftReview";

import ManageCampaign from "src/pages/admin/campaigns/ManageCampaign";

// Donor Pages
import DonationLayout from "src/pages/donor/DonationLayout";
import Donation from "src/pages/donor/donation/Donation";
import Checkout from "src/pages/donor/donation/Checkout";
import CheckoutComplete from "src/pages/donor/donation/CheckoutComplete";
import TermsOfService from "src/pages/donor/donation/TermsOfService";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <div>
      <Routes location={background || location}>
        <Route path="/login" element={<Login />} />
        <Route element={<DonationLayout />}>
          <Route path="/" element={<Donation />} />
          <Route path="terms" element={<TermsOfService />} />
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
          <Route path="/admins">
            <Route index element={<Dashboard />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="donors" element={<Donors />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DraftLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/campaigns/:campaignId" element={<ManageCampaign />} />
          <Route element={<DraftLayout />}>
            <Route path="draft/title" element={<DraftTitle />} />
            <Route path="draft/description" element={<DraftDescription />} />
            <Route path="draft/campaign-image" element={<DraftImage />} />
            <Route path="draft/goal" element={<DraftGoal />} />
            <Route path="draft/date" element={<DraftDate />} />
            <Route path="draft/review" element={<DraftReview />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/admins/donors/:donorId" element={<ManageDonor />} />
          <Route
            path="/admins/campaigns/:campaignId"
            element={<ManageCampaign />}
          />
          <Route
            path="/admins/emails/email-template/receipt"
            element={<EmailTemplate />}
          />
          <Route
            path="/admins/emails/email-template/impact"
            element={<EmailTemplate />}
          />
          <Route
            path="/admins/emails/email-template/closeout"
            element={<EmailTemplate />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
