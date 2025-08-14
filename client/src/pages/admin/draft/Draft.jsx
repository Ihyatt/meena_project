import "src/assets/css/Modal.css"

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "src/components/Loading";
import useDraftStore from 'src/pages/admin/draft/store';
import ImageUpload from 'src/pages/admin/components/ImageUpload'
import useAuthStore from "src/pages/auth/store";


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;


export const CampaignDraft = () => {

  const [campaignId, setCampaignId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const isCancelled = useRef(false);
  const anchor = useRef(null);



  const modalRef = useRef();
  const navigate = useNavigate();
  const {
    fetchCampaignDraft,
    saveCampaign,
    shareCampaignDraft,
    upload,
    isLoading,
  } = useDraftStore();

  useEffect(() => {
    const fetchCampaignDraft = async () => {
      const { jwtToken } = useAuthStore.getState();
      const response = await fetch(`${backednUrl}/admins/campaigns/drafts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCampaignId(data.id);
      setTitle(data.title);
      setDescription(data.description);
      setGoal(data.goal);
      setImageUrl(data.imageUrl);
      console.log('fetchCampaignDraft response:', data);
    }
    fetchCampaignDraft();
  }, [fetchCampaignDraft]);

  useEffect(() => {
    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

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
    saveCampaign(campaignId, title, description, goal).then((data) => {
      setTitle(data.title);
      setDescription(data.description);
      setGoal(data.goal);
    });
    event.preventDefault();
  }

  const uploadFile = (campaignId, file) => {
    setFile(file);
    upload(campaignId, file).then((data) => {
      setImageUrl(data.url);
      setFile(null);
    });
  };

  return (
    <div ref={modalRef} className="modal-wrapper" >
      {isLoading && <Loading />}
      <div className="modal rounded-lg">
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
          <ImageUpload campaignId={campaignId} imageUrl={imageUrl} uploadFile={uploadFile} />
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