import React, { useEffect, useState } from "react";
import useAdminStore from "src/pages/admin/store";
import DonationsHeatMap from "src/pages/admin/donation/HeatMap";
import DonationsScatterChart from "src/pages/admin/donation/ScatterChart";
import DonationsBarChart from "src/pages/admin/donation/BarChart";
import DonationEvents from "src/components/Events";
import { NumericFormat } from "react-number-format";
import DonationContext from "src/pages/donor/donation/components/DonationContext";

import Loading from "src/components/Loading";

import {
  RiHandHeartFill,
  RiMegaphoneFill,
  RiMoneyDollarCircleFill,
  RiUserHeartFill,
} from "react-icons/ri";

const Dashboard = () => {
  const [donationsLocation, setDonationsLocation] = useState([]);
  const [launchedCampaigns, setLaunchedCampaigns] = useState(0);
  const [donationsCount, setDonationsCount] = useState(0);
  const [raised, setRaised] = useState(0);
  const [donorsCount, setDonorsCount] = useState(0);
  const [donationsWindow, setDonationsWindow] = useState([]);

  const { fetchDashboardData, isLoading } = useAdminStore();

  useEffect(() => {
    fetchDashboardData().then((data) => {
      setLaunchedCampaigns(data.launchedCampaigns);
      setDonationsCount(data.donationsCount);
      setRaised(data.raised);
      setDonorsCount(data.donorsCount);
      setDonationsLocation([]);
      setDonationsWindow([]);
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

  const donationContextValue = {
    handleDonationUpdate: handleNewDonation,
    handleDonorUpdate: () => setDonorsCount((prev) => prev + 1),
  };
  return (
    <div>
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
              className="inline #edafb0 rounded-xl"
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
        <div className="h-105 flex-grow">
          <DonationsHeatMap donations={donationsLocation} />
        </div>
        <div className="w-80 ml-4 rounded-lg shadow-md bg-white p-4">
          <div className="text-gray-400 ">RECENT DONATIONS</div>
          <DonationContext.Provider value={donationContextValue}>
            <DonationEvents />
          </DonationContext.Provider>
        </div>
      </div>

      <div className="flex m-4">
        <div className="w-1/2  mr-2 rounded-lg shadow-md bg-white">
          <DonationsBarChart window={donationsWindow} />
        </div>
        <div className="w-1/2 ml-2 rounded-lg shadow-md bg-white">
          <DonationsScatterChart window={donationsWindow} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
