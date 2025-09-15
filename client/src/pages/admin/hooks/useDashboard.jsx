import React, { useEffect, useState } from "react";

import useAdminStore from "src/pages/admin/store";

const useDashboard = () => {
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
  return {
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
  };
};
export default useDashboard;
