import "src/assets/css/Modal.css";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import ImageUpload from "src/pages/admin/components/ImageUpload";
import ErrorAlert from "src/components/ErrorAlert";

import useCampaignStore from "src/pages/admin/campaigns/store";
import Loading from "src/components/Loading";

export const CampaignDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = location.state?.isModal;
  const modalRef = useRef();
  const { campaignId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);

  const { fetchCampaign, saveCampaign, isLoading, upload } = useCampaignStore();

  console.log("why is it not working", campaignId);

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
    navigate(-1);
    event.preventDefault();
  };

  const handleSave = (event) => {
    if (!title || !description || !goal || !imageUrl) {
      const errors = [];
      if (!title) {
        errors.push("Title is required.");
      }
      if (!description) {
        errors.push("Description is required.");
      }
      if (goal <= 0) {
        errors.push("Goal must be greater than 0.");
      }
      if (!imageUrl) {
        errors.push("Image is required.");
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
  };
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
      window.alert(
        `Description cannot exceed ${descriptioncharactersLimit} characters.`
      );
    }
  };

  const uploadFile = (file) => {
    upload(campaignId, file).then((data) => {
      setImageUrl(data.url);
      setFile(null);
    });
  };

  const handleErrorClose = () => {
    console.log("Error alert closed");
    setErrors([]);
  };

  return (
    <div ref={modalRef} className="modal-wrapper">
      {isLoading && <Loading />}
      <div className="modal rounded-lg">
        <form className="max-w-xl mx-auto p-5">
          <div className="p-2">
            <label class="block mb-2 text-sm text-slate-600">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
              required
            />
          </div>
          <div className="p-2">
            <label class="block mb-2 text-sm text-slate-600">Description</label>
            <textarea
              id="description"
              placeholder="Description..."
              value={description}
              onChange={handleDescriptionChange}
              rows="4"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
            ></textarea>
          </div>
          <div className="p-2">
            <label class="block mb-2 text-sm text-slate-600">Goal</label>
            <input
              type="number"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              required
            />
          </div>
          <ImageUpload
            campaignId={campaignId}
            imageUrl={imageUrl}
            uploadFile={uploadFile}
          />
          <div className="flex  justify-end mt-4">
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
          {errors.length > 0 && (
            <ErrorAlert errors={errors} onClose={handleErrorClose} />
          )}
        </form>
      </div>
    </div>
  );
};
