// External Stylesheets
import "src/assets/css/Modal.css";

// React Hooks and Router
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// External Libraries
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import Loading from "src/components/Loading";

import TitleForm from "src/pages/campaign/components/TitleForm";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";

export const TitleModal = ({ onClose }) => {
  const location = useLocation();
  const isModal = location.state?.isModal;
  const modalRef = useRef();
  const { isLoading, saveDraft, setOpenTitleModal } = useManageCampaign();

  useEffect(() => {
    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  const handleSave = (event) => {
    event.preventDefault();
    saveDraft().then((success) => {
      if (success) {
        onClose();
      } else {
        console.error("Error saving draft");
      }
    });
  };

  return (
    <div ref={modalRef} className="modal-wrapper">
      {isLoading && <Loading />}
      <div className="campaign-review-modal rounded-lg">
        <div> Edit Date</div>
        <TitleForm />
        <button
          type="button"
          className="text-white bg-[#0fa347]  focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-[#2bbd62] "
          onClick={handleSave}
          disabled={isLoading}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default TitleModal;
