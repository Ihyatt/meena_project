import React, { useEffect, useState } from 'react';
import useAdminStore from 'src/stores/Admin';
import DonationsHeatMap from 'src/pages/admin/components/DonationsHeatMap'
import DonationsScatterChart from 'src/pages/admin/components/DonationsScatterChart'
import DonationsBarChart from 'src/pages/admin/components/DonationsBarChart';
import Campaigns from 'src/pages/admin/components/CampaignsCarousel'
import { DonorsTable } from 'src/pages/admin/components/DonorsTable'
import MasterDonationBar from "src/components/MasterDonationBar";
import { NumericFormat } from 'react-number-format';

import DonationEvents from 'src/components/DonationEvents.jsx'

import Loading from "src/components/Loading";


import {
  RiHandHeartLine,
  RiUserHeartLine,
  RiMoneyDollarBoxLine,
  RiMegaphoneLine,
  RiHandHeartFill,
  RiMegaphoneFill,
  RiMoneyDollarCircleFill,
  RiUserHeartFill,
} from "react-icons/ri";

const Dashboard = () => {

  const { fetchCampaigns, launchedCampaigns, numDonors, isLoading, masterCampaign, error } = useAdminStore();

  useEffect(() => {
    fetchCampaigns();

  }, [fetchCampaigns]);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="m-4 grid gap-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-4 grid-cols-4">
        <div
          className="grid grid-cols-1 content-center justify-items-center shadow-sm h-20 "
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
          className="grid grid-cols-1 content-center justify-items-center shadow-sm h-20 "
          style={{ backgroundColor: "white", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiHandHeartFill size={25} color={'white'} className="inline bg-[#40bf51] rounded-xl p-1" /> <span className='text-xl'>{masterCampaign?.totalDonations || 0}</span>
          </div>
          <div className="text-black">
            DONATIONS
          </div>
        </div>
        <div
          className=" grid grid-cols-1 content-center justify-items-center text-black shadow-sm h-20 "
          style={{ backgroundColor: "white", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiMoneyDollarCircleFill size={30} color={'#40bf51'} className="inline bg-white" />
            <span className='text-xl'>
              <NumericFormat
                value={masterCampaign?.raised || 0}
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
          className=" grid grid-cols-1 content-center justify-items-center text-black shadow-sm min-h-20 "
          style={{ backgroundColor: "white", color: "#40bf51" }}
        >
          <div className="flex items-center space-x-2">
            <RiUserHeartFill size={25} color={'white'} className="inline bg-[#40bf51] rounded-xl p-1" /> <span className='text-xl'>{numDonors}</span>
          </div>
          <div className="text-black">
            DONORS
          </div>
        </div>
      </div>
      <div className="mx-4 ">
        <div className=" h-80">
          <DonationsHeatMap />
        </div >


      </div>
      <div className="m-4 grid grid-cols-4 gap-4">
        <div className="col-start-1 col-span-2 h-70">
          <DonationsBarChart />
        </div >
        <div className="col-start-3 col-span-2 h-70">
          <DonationsScatterChart />
        </div >

      </div>
      <div className="m-4 h-70 grid lg:grid-cols-12 md:grid-cols-12 sm:grid-cols-1 grid-cols-1">
        <Campaigns />
      </div>
      <div className="m-4 grid lg:grid-cols-12 md:grid-cols-12 sm:grid-cols-1 grid-cols-1">
        <DonorsTable />
      </div>
    </div >
  );

};

export default Dashboard;