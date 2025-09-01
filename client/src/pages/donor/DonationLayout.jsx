import { Outlet } from "react-router-dom";
import { Footer } from "src/pages/donor/donation/components/Footer";
import { Header } from "src/pages/donor/donation/components/Header";

const DonationLayout = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-8">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
export default DonationLayout;
