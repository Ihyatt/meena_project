// Local components and assets
import Loading from "src/components/Loading";
import DonationEvents from "src/components/Events";
import About from "src/pages/donation/components/About";
import defaultImg from "src/assets/images/defaultImg.jpg";
import DonationForm from "src/pages/donation/components/DonationForm";
import DonationData from "src/pages/donation/components/DonationData";

import CoverImage from "src/pages/donation/components/CoverImage";
import CeoData from "src/pages/donation/components/CeoData";

// Context and state management
import Button from "src/pages/donation/components/Button";
import DonorActivity from "src/components/DonorActivity";
import CampaignTitle from "src/pages/donation/components/CampaignTitle";

import useDonation from "src/pages/donation/hooks/useDonation";

const Donation = () => {
  const {
    campaignData,
    copyText,
    targetRef,
    isLoading,
    percentage,
    handleCopy,
    scrollToTarget,
    handleNewDonation,
    handleDonorUpdate,
  } = useDonation();
  return (
    <div>
      {isLoading && <Loading />}
      <CampaignTitle title={campaignData.title} />
      <div className="">
        <CoverImage imageUrl={campaignData.imageUrl || defaultImg} />
        <div className=" ">
          <div className="block lg:hidden">
            <DonationData
              percentage={percentage}
              activeCampaign={campaignData.activeCampaign}
              goal={campaignData.goal}
              raised={campaignData.raised}
              totalDonations={campaignData.totalDonations}
            />
          </div>
          <About description={campaignData.description} />
          <DonationForm targetRef={targetRef} />
        </div>
        <div className="hidden lg:block col-span-3 ">
          <CeoData />
          <DonationData
            percentage={percentage}
            activeCampaign={campaignData.activeCampaign}
            goal={campaignData.goal}
            raised={campaignData.raised}
            totalDonations={campaignData.totalDonations}
          />

          <div className="">
            <Button
              onClick={scrollToTarget}
              className=" mr-1 text-white bg-[#0fa347] hover:bg-[#2bbd62]"
            >
              DONATE NOW
            </Button>
            <Button
              onClick={handleCopy}
              className=" text-[#0fa347]  border border-[#0fa347] hover:border-[#2bbd62] hover:text-[#2bbd62]  ml-1 "
            >
              {copyText}
            </Button>

            <DonorActivity donorsCount={campaignData.donorsCount} size={30} />
            <div className="mt-5">
              <DonationEvents
                handleNewDonation={handleNewDonation}
                handleDonorUpdate={handleDonorUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
