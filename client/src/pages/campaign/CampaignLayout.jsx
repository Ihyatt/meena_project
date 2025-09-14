import { Link, Outlet } from "react-router-dom";

import "src/assets/css/CampaignForm.css";

const CampaignLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
export default CampaignLayout;
