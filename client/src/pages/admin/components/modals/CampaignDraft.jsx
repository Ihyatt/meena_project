import "src/assets/css/Modal.css"

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "src/components/Loading";
import useAdminStore from 'src/stores/Admin';
import ImageUpload from 'src/components/ImageUpload'

export const CampaignDraft = () => {

  const modalRef = useRef();
  const navigate = useNavigate();
  const {
    campaignId,
    fetchCampaignDraft,
    saveCampaign,
    setTitle,
    setDescription,
    setGoal,
    title,
    description,
    goal,
    shareCampaignDraft,
    isLoading,
  } = useAdminStore();

  useEffect(() => {
    fetchCampaignDraft()

    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, [fetchCampaignDraft]);

  const characterLimit = 200;

  const handleClose = (event) => {
    navigate('/admins')
    event.preventDefault();
  }


  const handleShare = (event) => {
    shareCampaignDraft(campaignId)

    navigate('/admins')
    event.preventDefault();
  }

  const handleSave = (event) => {
    saveCampaign(campaignId)
    event.preventDefault();

  }

  return (
    <div ref={modalRef} className="modal-wrapper" >
      {isLoading && <Loading />}

      <div className="modal">
        <form className="max-w-xl mx-auto p-5">
          <div className="input-container">
            <input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-none box-border resize-none block mb-1 text-2xl focus:outline-none"
              required
            />
          </div>

          <div className="input-container">
            <textarea
              id="description"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full border-none box-border resize-none block mb-1 text-sm h-50 focus:outline-none"
            ></textarea>
            <div className="text-sm text-gray-400 mt-1">
              {description.length}/{characterLimit}
            </div>
          </div>
          <div className="flex items-center border-2 border-solid  p-1 rounded-sm">
            <div className="text-sm text-gray-400 mr-1">
              goal:
            </div>
            <div className="input-container ">
              <input
                type="number"
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full border-none box-border resize-none input-target-amount text-sm"
                required
              />
            </div>
          </div>
          <ImageUpload campaignId={campaignId} />
          <div className="flex items-center mt-8 justify-between">
            <button
              type="button"
              className="
                h-6
                w-[110px]
                cursor-pointer
                bg-[rgb(234,237,241)]
                border-none
                text-[rgb(100,111,124)]
                rounded-full
                m-1.5
              "
              onClick={handleClose}
              disabled={isLoading}>
              Close
            </button>
            <div>
              <button
                type="button"
                className="
                  h-6
                  w-[110px]
                  cursor-pointer
                  bg-white
                  text-black
                  rounded-full
                  m-1.5
                  border-2
                  border-black
                  font-medium
                "
                onClick={handleSave}
                disabled={isLoading}
              >
                Save
              </button>
              <button
                type="button"
                className="
                  m-1.5
                  h-6
                  w-[110px]
                  bg-[#40bf51]
                  text-white
                  border-none
                  cursor-pointer
                  rounded-full
                  font-medium
                "
                onClick={handleShare}
                disabled={isLoading}>
                Share
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}