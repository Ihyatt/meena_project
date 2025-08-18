import React, { useEffect, useState } from 'react';
import useAdminStore from 'src/pages/admin/store';
import DonationsHeatMap from 'src/pages/admin/donation/HeatMap'
import DonationsScatterChart from 'src/pages/admin/donation/ScatterChart'
import DonationsBarChart from 'src/pages/admin/donation/BarChart';
import { NumericFormat } from 'react-number-format';


import Loading from "src/components/Loading";


import {
  RiHandHeartFill,
  RiMegaphoneFill,
  RiMoneyDollarCircleFill,
  RiUserHeartFill,
} from "react-icons/ri";

const Dashboard = () => {

  const { fetchCampaigns, launchedCampaigns, totalHistoricalDonors, isLoading, totalHistoricalDonations, totalHistoricalRaised } = useAdminStore();

  useEffect(() => {
    fetchCampaigns();

  }, [fetchCampaigns]);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="m-4  grid gap-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-4 grid-cols-4">
        <div
          className="grid grid-cols-1 content-center justify-items-center rounded-lg shadow-sm h-20 "
          style={{ backgroundColor: "white", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiMegaphoneFill size={25} color={'white'} className="inline bg-[#40bf51] rounded-xl p-1" /> <span className='text-xl'>{launchedCampaigns}</span>
          </div>
          <div className="text-black">
            CAMPAIGNS
          </div>
        </div>
        <div
          className="grid grid-cols-1 content-center justify-items-center rounded-lg shadow-sm h-20 "
          style={{ backgroundColor: "white", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiHandHeartFill size={25} color={'white'} className="inline bg-[#40bf51] rounded-xl p-1" /> <span className='text-xl'>{totalHistoricalDonations || 0}</span>
          </div>
          <div className="text-black">
            DONATIONS
          </div>
        </div>
        <div
          className=" grid grid-cols-1 content-center justify-items-center text-black rounded-lg shadow-sm h-20 "
          style={{ backgroundColor: "white", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiMoneyDollarCircleFill size={30} color={'#40bf51'} className="inline bg-white" />
            <span className='text-xl'>
              <NumericFormat
                value={totalHistoricalRaised || 0}
                thousandSeparator={true}
                prefix="$"
                decimalScale={2}
                displayType="text"
              />
            </span>
          </div>
          <div className="text-black">
            RAISED
          </div>
        </div>
        <div
          className=" grid grid-cols-1 content-center justify-items-center text-black rounded-lg  shadow-sm min-h-20 "
          style={{ backgroundColor: "white", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiUserHeartFill size={25} color={'white'} className="inline bg-[#40bf51] rounded-xl p-1" /> <span className='text-xl'>{totalHistoricalDonors}</span>
          </div>
          <div className="text-black">
            DONORS
          </div>
        </div>
      </div>
      <div className="m-4 ">
        <div className=" h-83">
          <DonationsHeatMap />
        </div >
      </div>

      <div className="flex m-4">
        <div className="w-1/2  mr-2 rounded-lg shadow-md bg-white">
          <DonationsBarChart />
        </div>
        <div className="w-1/2 ml-2 rounded-lg shadow-md bg-white">
          <DonationsScatterChart />
        </div>
      </div>
    </div >
  );

};

export default Dashboard;