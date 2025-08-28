import { Outlet } from "react-router-dom";
import { Footer } from "src/pages/donor/donation/components/Footer";

const DonationLayout = () => {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
};
export default DonationLayout;
