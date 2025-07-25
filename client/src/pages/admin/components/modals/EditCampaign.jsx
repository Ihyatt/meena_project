import "src/assets/css/Modal.css"

import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import ImageUpload from 'src/components/ImageUpload'

import useAdminStore from 'src/stores/Admin';
import Loading from "src/components/Loading";


export const CampaignDetails = () => {

  const modalRef = useRef();
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const {
    fetchCampaign,
    saveCampaign,
    setTitle,
    setDescription,
    setTargetAmount,
    title,
    description,
    goal,
    isLoading,
  } = useAdminStore();

  useEffect(() => {
    fetchCampaign(campaignId)

    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, [fetchCampaign, campaignId]);

  const handleClose = (event) => {
    navigate('/admins')
    event.preventDefault();
  }

  const handleSave = (event) => {
    saveCampaign(campaignId)
    event.preventDefault();
  }
  const characterLimit = 200;

  return (
    <div ref={modalRef} className="modal-wrapper" >


      <div className="modal ">
        <form className="max-w-xl mx-auto p-5">
          {isLoading && <Loading />}
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

          <div className="flex items-center border-2 border-solid p-1">
            <div className="text-sm text-gray-400 mr-1">
              goal:
            </div>
            <div className="input-container ">
              <input
                type="number"
                id="targetAmount"
                value={goal}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border-none box-border resize-none input-target-amount text-sm"
                required
              />
            </div>
          </div>
          <ImageUpload campaignId={campaignId} />

          <div className="flex items-center mt-8 justify-between" >
            <div></div>
            <div>
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
                disabled={isLoading}
              >
                Close
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
                onClick={handleSave}
                disabled={isLoading}
              >
                Save
              </button>
            </div>
          </div>
        </form>

      </div >
    </div >
  );
}