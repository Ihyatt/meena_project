import "src/assets/css/Modal.css"

import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import ImageUpload from 'src/pages/admin/components/ImageUpload'
import useAuthStore from "src/pages/auth/store";
import ErrorAlert from "src/pages/admin/components/ErrorAlert";

import useCampaignStore from 'src/pages/admin/campaigns/store.jsx';
import Loading from "src/components/Loading";
const backednUrl = import.meta.env.VITE_BACKEND_API_URL;


export const CampaignDetails = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);

  const modalRef = useRef();
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const {
    fetchCampaign,
    saveCampaign,
    isLoading,
    upload
  } = useCampaignStore();

  useEffect(() => {

    fetchCampaign(campaignId).then((data) => {
      setTitle(data.title);
      setDescription(data.description);
      setGoal(data.goal);
      setImageUrl(data.imageUrl);
    });

  }, [fetchCampaign]);


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

  const handleSave = (event) => {
    if (!title || !description || !goal || !imageUrl) {
      const errors = [];
      if (!title) {
        errors.push('Title is required.');
      }
      if (!description) {
        errors.push('Description is required.');
      }
      if (goal <= 0) {
        errors.push('Goal must be greater than 0.');
      }
      if (!imageUrl) {
        errors.push('Image is required.');
      }
      setErrors(errors);
      return;
    }
    saveCampaign(campaignId, title, description, goal).then((data) => {
      setTitle(data.title);
      setDescription(data.description);
      setGoal(data.goal);
    });
    event.preventDefault();
  }
  const descriptioncharactersLimit = 200;
  const titlecharactersLimit = 50;

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= titlecharactersLimit) {
      setTitle(value);
    } else {
      window.alert(`Title cannot exceed ${titlecharactersLimit} characters.`);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= descriptioncharactersLimit) {
      setDescription(value);
    } else {
      window.alert(`Description cannot exceed ${descriptioncharactersLimit} characters.`);
    }
  };


  const uploadFile = (file) => {
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
              onChange={handleTitleChange}
              className="w-full border-none box-border resize-none block mb-1 text-2xl focus:outline-none"
              required
            />
          </div>
          <div className="input-container">
            <textarea
              id="description"
              placeholder="Description..."
              value={description}
              onChange={handleDescriptionChange}
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
                className="w-full border-none box-border resize-none input-target-amount text-sm focus:outline-none"
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
                disabled={isLoading}
              >
                Share
              </button>
            </div>
          </div>
          {errors.length > 0 && <ErrorAlert errors={errors} onClose={handleErrorClose} />}
        </form>
      </div>
    </div>
  );
}