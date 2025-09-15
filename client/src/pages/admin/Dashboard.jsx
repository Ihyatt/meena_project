// React and hooks
import React, { useEffect, useState } from "react";

// Icons
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  RiHandHeartFill,
  RiMegaphoneFill,
  RiMoneyDollarCircleFill,
  RiUserHeartFill,
} from "react-icons/ri";

// External libraries
import { NumericFormat } from "react-number-format";

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

// Context and state management
import useAdminStore from "src/pages/admin/store";

const Dashboard = () => {
  const [donationsLocation, setDonationsLocation] = useState([]);
  const [launchedCampaigns, setLaunchedCampaigns] = useState(0);
  const [donationsCount, setDonationsCount] = useState(0);
  const [raised, setRaised] = useState(0);
  const [donorsCount, setDonorsCount] = useState(0);
  const [
    currYearIndividualDonationRetentionData,
    setCurrYearIndividualDonationRetentionData,
  ] = useState([]);

  const [trackActiveCammpaignDonations, setTrackActiveCammpaignDonations] =
    useState([]);
  const [allTimeDonationRetentionData, SetAllTimeDonationRetentionData] =
    useState([]);
  const [
    currYearByMonthDonationRetentionData,
    setCurrYearByMonthDonationRetentionData,
  ] = useState([]);

  const { fetchDashboardData, isLoading } = useAdminStore();

  useEffect(() => {
    fetchDashboardData().then((data) => {
      setLaunchedCampaigns(data.launchedCampaigns);
      setDonationsCount(data.donationsCount);
      setRaised(data.raised);
      setDonorsCount(data.donorsCount);
      setDonationsLocation(data.donationsLocation || []);
      setCurrYearIndividualDonationRetentionData(
        data.currYearIndividualDonationRetentionData || []
      );
      SetAllTimeDonationRetentionData(data.allTimeDonationRetentionData || []);
      setCurrYearByMonthDonationRetentionData(
        data.currYearByMonthDonationRetentionData || []
      );
      setTrackActiveCammpaignDonations(
        data.trackActiveCammpaignDonations || []
      );
    });
  }, []);

  const handleNewDonation = (newAmount) => {
    setRaised((prevRaised) => {
      const amountAsNumber = Number(newAmount);
      const prevRaisedAsNumber = Number(prevRaised);
      return prevRaisedAsNumber + amountAsNumber;
    });
    setDonationsCount((prevCount) => prevCount + 1);
  };
  const handleDonorUpdate = () => {
    setDonorsCount((prev) => prev + 1);
  };

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
