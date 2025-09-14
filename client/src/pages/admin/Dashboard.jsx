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
  }, [fetchDashboardData]);

  const handleNewDonation = (newAmount) => {
    setRaised((prevRaised) => {
      const amountAsNumber = Number(newAmount);
      const prevRaisedAsNumber = Number(prevRaised);
      return prevRaisedAsNumber + amountAsNumber;
    });
    setDonationsCount((prevCount) => prevCount + 1);
  };
  const handleDonorUpdate = () => {
    setCampaignData((prevData) => ({
      ...prevData,
      donorsCount: prevData.donorsCount + 1,
    }));
  };

  return (
    <div className="m-2">
      {isLoading && <Loading />}
      <div className="m-4  grid gap-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-4 grid-cols-4">
        <div
          className="grid grid-cols-1 content-center justify-items-center rounded-lg shadow-sm h-20 "
          style={{ backgroundColor: "#edafb0", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiMegaphoneFill
              size={25}
              color={"#edafb0"}
              className="inline bg-white rounded-xl p-1"
            />{" "}
            <span className="text-xl text-white">{launchedCampaigns}</span>
          </div>
          <div className="text-white">CAMPAIGNS</div>
        </div>
        <div
          className="grid grid-cols-1 content-center justify-items-center rounded-lg shadow-sm h-20 "
          style={{ backgroundColor: "#edafb0", color: "white" }}
        >
          <div className="flex items-center space-x-2">
            <RiHandHeartFill
              size={25}
              color={"#edafb0"}
              className="inline bg-white rounded-xl p-1"
            />{" "}
            <span className="text-xl">{donationsCount || 0}</span>
          </div>
          <div className="text-white">DONATIONS</div>
        </div>
        <div
          className=" grid grid-cols-1 content-center justify-items-center text-black rounded-lg shadow-sm h-20 "
          style={{ backgroundColor: "#edafb0", color: "white" }}
        >
          <div className="flex items-center space-x-1">
            <RiMoneyDollarCircleFill
              size={30}
              color={"white"}
              className="inline  rounded-xl"
            />
            <span className="text-xl">
              <NumericFormat
                value={raised || 0}
                thousandSeparator={true}
                prefix="$"
                decimalScale={2}
                displayType="text"
              />
            </span>
          </div>
          <div className="text-white">RAISED</div>
        </div>
        <div
          className=" grid grid-cols-1 content-center justify-items-center text-black rounded-lg  shadow-sm min-h-20 "
          style={{ backgroundColor: "#edafb0", color: "white" }}
        >
          <div className="flex items-center space-x-2">
            <RiUserHeartFill
              size={25}
              color={"#edafb0"}
              className="inline bg-white rounded-xl p-1"
            />{" "}
            <span className="text-xl">{donorsCount}</span>
          </div>
          <div className="text-white">DONORS</div>
        </div>
      </div>
      <div className="flex m-4 ">
        <div className="h-120 flex-grow">
          <DonationsHeatMap donations={donationsLocation} />
        </div>
        <div className="w-80 ml-4 rounded-lg shadow-md bg-white  p-8 h-120">
          {donorsCount > 0 && (
            <div className="flex justify-start  items-center mt-2 mb-4">
              <FaArrowTrendUp
                size={35}
                color="#DB5758"
                className="inline bg-[#edafb0] rounded-full p-1"
              />{" "}
              <div className="text-sm font-bold  ml-3 text-[#DB5758]">
                {donorsCount} {donorsCount == 1 ? "person " : "people "}
                just donated
              </div>
            </div>
          )}
          <div className="text-gray-400 ">RECENT DONATIONS</div>
          <DonationEvents
            handleNewDonation={handleNewDonation}
            handleDonorUpdate={handleDonorUpdate}
          />
        </div>
      </div>
      <div className="  h-full">
        <div className="flex m-4 h-100">
          <div className="w-1/2  mr-2 rounded-lg shadow-md bg-white flex items-center justify-center p-8">
            <BarChart
              currYearByMonthDonationRetentionData={
                currYearByMonthDonationRetentionData
              }
            />
          </div>
          <div className="w-1/2  ml-2 rounded-lg shadow-md bg-white flex items-center justify-center pt-8 px-8 pb-14">
            <LineChart
              trackActiveCammpaignDonations={trackActiveCammpaignDonations}
            />
          </div>
        </div>
        <div className="flex m-4 h-100">
          <div className="w-1/2  mr-2 rounded-lg shadow-md bg-white flex items-center justify-center p-8">
            <PieChart
              allTimeDonationRetentionData={allTimeDonationRetentionData}
            />
          </div>
          <div className="w-1/2 ml-2 rounded-lg shadow-md bg-white">
            <ScatterChart
              currYearIndividualDonationRetentionData={
                currYearIndividualDonationRetentionData
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
