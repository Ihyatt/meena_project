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
import DashboardLayout from "src/pages/admin";
import Dashboard from "src/pages/admin/Dashboard";
import Campaigns from "src/pages/admin/campaigns";
import Donors from "src/pages/admin/donors";
import { EmailTemplate } from "src/pages/admin/emailTemplate";
import { ManageDonor } from "src/pages/admin/donors/ManageDonor";

//Admin Capaign Pages
import DraftTitle from "src/pages/campaign/pages/Title";
import DraftDescription from "src/pages/campaign/pages/Description";
import DraftGoal from "src/pages/campaign/pages/Goal";
import DraftImage from "src/pages/campaign/pages/Image";
import DraftDate from "src/pages/campaign/pages/Date";
import Review from "src/pages/campaign/pages/Review";
import CampaignReview from "src/pages/campaign/pages/CampaignReview";

import CampaignLayout from "src/pages/campaign";

// Donor Pages
import DonationLayout from "src/pages/donation";
import Donation from "src/pages/donation/pages/Donation";
import Checkout from "src/pages/donation/pages/Checkout";
import CheckoutComplete from "src/pages/donation/pages/CheckoutComplete";
import TermsOfService from "src/pages/donation/pages/TermsOfService";

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
              <CampaignLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<CampaignLayout />}>
            <Route path="draft/title" element={<DraftTitle />} />
            <Route path="draft/description" element={<DraftDescription />} />
            <Route path="draft/image" element={<DraftImage />} />
            <Route path="draft/goal" element={<DraftGoal />} />
            <Route path="draft/date" element={<DraftDate />} />
            <Route path="draft/review" element={<Review />} />
            <Route path="campaigns/:campaignId" element={<CampaignReview />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/admins/donors/:donorId" element={<ManageDonor />} />
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
