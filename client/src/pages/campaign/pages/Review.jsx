import "src/assets/css/CampaignForm.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useDraftStore from "src/pages/campaign/store";

import Progressbar from "src/components/Progressbar";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import EllipsisText from "react-ellipsis-text";

import Modal from "src/pages/campaign/pages/modals/Title";
import FormatDate from "src/utils/FormatDate";
import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";
import { FUNDING_STEP } from "src/utils/Constants";

import Footer from "src/pages/campaign/components/Footer";
import SubSection from "src/pages/campaign/components/SubSection";
import ImageSubSection from "src/pages/campaign/components/ImageSubSection";
import ReviewDescription from "src/pages/campaign/components/ReviewDescription";
import { REVIEW_DESCRIPTION } from "src/utils/Constants";

import { CampaignContext } from "src/pages/campaign/context/campaignContext";

const Review = () => {
  const { goal, title, description, imageUrl, closeoutDate, isLoading } =
    useManageCampaign();

  const openTitleModal = () => {};

  const openDescriptionModal = () => {};

  const openImageModal = () => {};

  const openDateModal = () => {};

  const openGoalModal = () => {};

  const isButtonDisabled = !closeoutDate || isLoading;

  const links = {
    prevLink: "/draft/date",
    nextLink: "/draft/image",
  };
  console.log(closeoutDate);
  return (
    <div className="flex w-full h-screen bg-[#f5f5f5]">
      <ReviewDescription descriptionText={REVIEW_DESCRIPTION} />
      <div className="w-full sm:w-1/2 md:w-3/5 lg:w-2/3 bg-white h-full shadow-lg flex flex-col justify-between rcorners">
        <div className=" sm:px-15 md:px-25 lg:px-35 pt-50  overflow-y-auto ">
          <ImageSubSection
            sectionText="Cover Image"
            section={imageUrl}
            openModal={openImageModal}
          />

          <SubSection
            sectionText="Title"
            section={title}
            openModal={openTitleModal}
          />

          <SubSection
            sectionText="Description"
            section={description}
            openModal={openDescriptionModal}
          />

          <SubSection
            sectionText="Goal"
            section={goal}
            openModal={openGoalModal}
          />

          <SubSection
            sectionText="End Date"
            section={<FormatDate date={closeoutDate} />}
            openModal={openDateModal}
          />
        </div>

        <CampaignContext.Provider value={links}>
          <Footer
            progressStep={FUNDING_STEP}
            isButtonDisabled={isButtonDisabled}
          />
        </CampaignContext.Provider>
      </div>
    </div>
  );
};
export default Review;
