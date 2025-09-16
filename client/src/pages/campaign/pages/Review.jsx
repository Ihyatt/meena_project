import "src/assets/css/CampaignForm.css";
import React, { useState, useEffect, useContext } from "react";

import EllipsisText from "react-ellipsis-text";

import TitleModal from "src/pages/campaign/pages/modals/Title";
import DateModal from "src/pages/campaign/pages/modals/Date";
import DescriptionModal from "src/pages/campaign/pages/modals/Description";
import GoalModal from "src/pages/campaign/pages/modals/Goal";
import ImageModal from "src/pages/campaign/pages/modals/Image";

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

  const [openTitleModal, setOpenTitleModal] = useState(false);

  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  const openTitleModalHandler = () => setOpenTitleModal(true);
  const closeTitleModalHandler = () => setOpenTitleModal(false);

  const openDescriptionModalHandler = () => setOpenDescriptionModal(true);
  const closeDescriptionModalHandler = () => setOpenDescriptionModal(false);

  const openGoalModalHandler = () => setOpenGoalModal(true);
  const closeGoalModalHandler = () => setOpenGoalModal(false);

  const openDateModalHandler = () => setOpenDateModal(true);
  const closeDateModalHandler = () => setOpenDateModal(false);

  const openImageModalHandler = () => setOpenImageModal(true);
  const closeImageModalHandler = () => setOpenImageModal(false);

  const links = {
    prevLink: "/draft/date",
    nextLink: "/draft/image",
  };
  console.log(closeoutDate);
  return (
    <div className="flex w-full h-screen bg-[#f5f5f5]">
      <ReviewDescription descriptionText={REVIEW_DESCRIPTION} />
      <div className="w-full sm:w-1/2 md:w-3/5 lg:w-2/3 bg-white h-full shadow-lg flex flex-col justify-between rcorners">
        <div className=" sm:px-15 md:px-25 lg:px-35 pt-50  overflow-y-auto">
          {openImageModal && <ImageModal onClose={closeImageModalHandler} />}
          <ImageSubSection
            sectionText="Cover Image"
            section={imageUrl}
            openModal={openImageModalHandler}
          />

          {openTitleModal && <TitleModal onClose={closeTitleModalHandler} />}
          <SubSection
            sectionText="Title"
            section={title}
            openModal={openTitleModalHandler}
          />

          {openDescriptionModal && (
            <DescriptionModal onClose={closeDescriptionModalHandler} />
          )}
          <SubSection
            sectionText="Description"
            section={<EllipsisText text={description} length={"60"} />}
            openModal={openDescriptionModalHandler}
          />
          {openGoalModal && <GoalModal onClose={closeGoalModalHandler} />}
          <SubSection
            sectionText="Goal"
            section={goal}
            openModal={openGoalModalHandler}
          />
          {openDateModal && <DateModal onClose={closeDateModalHandler} />}

          <SubSection
            sectionText="End Date"
            section={<FormatDate date={closeoutDate} />}
            openModal={openDateModalHandler}
          />
        </div>

        <CampaignContext.Provider value={links}>
          <Footer progressStep={FUNDING_STEP} isButtonDisabled={false} />
        </CampaignContext.Provider>
      </div>
    </div>
  );
};
export default Review;
