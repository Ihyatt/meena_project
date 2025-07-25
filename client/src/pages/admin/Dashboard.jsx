import React, { useEffect, useState } from 'react';
import useAdminStore from 'src/stores/Admin';
import DonationsHeatMap from 'src/pages/admin/components/DonationsHeatMap'
import DonationsChart from 'src/pages/admin/components/DonationsChart'
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
  RiMegaphoneLine
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
            <RiMegaphoneLine size={25} className="inline" /> <span className='text-xl'>{launchedCampaigns}</span>
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
            <RiHandHeartLine size={25} className="inline" /> <span className='text-xl'>{masterCampaign?.totalDonations || 0}</span>
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
            <RiMoneyDollarBoxLine size={25} className="inline" />
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
            <RiUserHeartLine size={25} className="inline" /> <span className='text-xl'>{numDonors}</span>
          </div>
          <div className="text-black">
            DONORS
          </div>
        </div>
      </div>
      <div className="mx-4 grid grid-cols-4 gap-4">
        <div className="col-start-1 col-span-2 h-80">
          <DonationsHeatMap />
        </div >
        <div className="col-start-3 col-span-2 h-80">
          <DonationsChart />
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