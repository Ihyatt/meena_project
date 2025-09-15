// Local components and charts
import DonationsHeatMap from "src/pages/admin/charts/HeatMap";
import ScatterChart from "src/pages/admin/charts/ScatterChart";
import BarChart from "src/pages/admin/charts/BarChart";
import LineChart from "src/pages/admin/charts/LineChart";
import PieChart from "src/pages/admin/charts/PieChart";
import DonationEvents from "src/components/Events";
import Loading from "src/components/Loading";
import DonorActivity from "src/components/DonorActivity";
import Header from "src/pages/admin/Header";

import useDashboard from "src/pages/admin/hooks/useDashboard";

// Context and state management

const Dashboard = () => {
  const {
    donationsLocation,
    launchedCampaigns,
    donationsCount,
    raised,
    donorsCount,
    currYearIndividualDonationRetentionData,
    trackActiveCammpaignDonations,
    allTimeDonationRetentionData,
    currYearByMonthDonationRetentionData,
    isLoading,
    handleNewDonation,
    handleDonorUpdate,
  } = useDashboard();
  return (
    <div className="m-2">
      {isLoading && <Loading />}
      <div className="m-4 grid gap-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-4 grid-cols-4">
        <Header
          launchedCampaigns={launchedCampaigns}
          donationsCount={donationsCount}
          raised={raised}
          donorsCount={donorsCount}
        />
      </div>
      <div className="flex m-4 ">
        <DonationsHeatMap donations={donationsLocation} />
        <div className="w-80 ml-4 rounded-lg shadow-md bg-white  p-8 h-120">
          <DonorActivity size={25} />

          <DonationEvents
            handleNewDonation={handleNewDonation}
            handleDonorUpdate={handleDonorUpdate}
          />
        </div>
      </div>
      <div className="flex m-4 h-100">
        <BarChart
          currYearByMonthDonationRetentionData={
            currYearByMonthDonationRetentionData
          }
        />
        <LineChart
          trackActiveCammpaignDonations={trackActiveCammpaignDonations}
        />
      </div>
      <div className="flex m-4 h-100">
        <PieChart allTimeDonationRetentionData={allTimeDonationRetentionData} />
        <ScatterChart
          currYearIndividualDonationRetentionData={
            currYearIndividualDonationRetentionData
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
