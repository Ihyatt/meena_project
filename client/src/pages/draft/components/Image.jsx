import "src/assets/css/CampaignForm.css";

import { useEffect, useState } from "react";
import useDraftStore from "src/pages/draft/store";
import ImageUpload from "src/components/ImageUpload";

import Progressbar from "src/components/Progressbar";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DraftImage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [closeoutDate, setCloseoutDate] = useState(new Date());

  const [file, setFile] = useState(null);

  const { fetchDraft, saveDraft, isLoading, upload } = useDraftStore();

  useEffect(() => {
    fetchDraft().then((data) => {
      setTitle(data.title);
      setCampaignId(data.id);
      setDescription(data.description);
      setGoal(data.goal);
      setImageUrl(data.imageUrl);
      setCloseoutDate(data.closeoutDate);
    });
  }, [fetchDraft]);

  const uploadFile = (file) => {
    upload(campaignId, file).then((data) => {
      setImageUrl(data.url);
      setFile(null);
    });
  };
  const handleSave = (event) => {
    event.preventDefault();

    navigate("/draft/date");
  };

  const step = 4;
  const stepText = "Add a photo to your campaign";
  const isButtonDisabled = !imageUrl || isLoading;
  return (
    <div className="flex col w-full h-screen  bg-[#f5f5f5]">
      <div className="sm:w-50/100  md:w-40/100  lg:w-34/100  h-screen ">
        <div className="pt-45 px-10 md:px-20 lg:px-20">
          <div className=" font-normal text-md pb-4  mb-4 border-b-2 border-[#0fa347] transition-colors duration-300">
            {step} of 5
          </div>
          <div className=" font-light text-5xl">{stepText}</div>
        </div>
      </div>
      <div className=" sm:w-50/100 md:w-60/100   lg:w-66/100 rcorners bg-white h-screen shadow-lg  min-h-screen flex flex-col justify-between">
        <div className="sm:px-10 md:px-20 lg:px-30 pt-50 ">
          <ImageUpload
            campaignId={campaignId}
            imageUrl={imageUrl}
            uploadFile={uploadFile}
          />
        </div>
        <footer className="w-full flex flex-col ">
          <Progressbar progress={(4 / 6) * 100} />
          <div className=" flex w-full p-10 justify-between items-center">
            <div>
              <Link
                to={"/draft/goal"}
                style={{ color: "black", fontSize: "15px" }}
              >
                <RiArrowLeftSLine size={40} />
              </Link>
            </div>
            <div>
              {!isButtonDisabled ? (
                <div
                  onClick={handleSave}
                  className="
                font-medium 
                text-base 
                flex-1 
                px-7 py-4
                border-none
                rounded 
                cursor-pointer
                rounded-full
                text-white bg-[#0fa347] hover:bg-[#2bbd62]
              "
                >
                  {" "}
                  CONTINUE
                </div>
              ) : (
                <div
                  className="
                font-semibold 
                text-base 
                flex-1 
                px-7 py-4
                border-none
                rounded 
                cursor-not-allowed
                rounded-full
                bg-[#d8d8d8] text-slate-700 "
                >
                  {" "}
                  CONTINUE
                </div>
              )}
            </div>
          </div>
        </footer>{" "}
      </div>
    </div>
  );
};
export default DraftImage;
