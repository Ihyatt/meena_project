import { Outlet } from "react-router-dom";
import { Footer } from "src/pages/donation/components/Footer";
import { Header } from "src/pages/donation/components/Header";

const DonationLayout = () => {
  return (
    <div className="px-20 py-6">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
export default DonationLayout;
