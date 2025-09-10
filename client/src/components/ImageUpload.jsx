import React, { useState, useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";

const ImageUpload = ({ imageUrl, uploadFile }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      setFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      uploadFile(file);
    } else {
      setFile(null);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {imageUrl ? (
        <div>
          <img
            src={imageUrl}
            alt="ui/ux review check"
            className="rounded-lg  h-100 w-full object-cover"
          />

          <div className="mt-2 ml-1 mr-1 flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />

            <label
              htmlFor="hiddenFileInput"
              onClick={handleIconClick}
              className="cursor-pointer flex items-center text-slate-700"
            >
              <div className="mr-2">Replace</div>
              <FiUploadCloud size={20} />
            </label>
          </div>
        </div>
      ) : (
        <div className="mt-2 ml-1 mr-1 flex flex-col items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />

          <label
            htmlFor="hiddenFileInput"
            onClick={handleIconClick}
            className="cursor-pointer flex flex-col items-center justify-center text-border text-[#b7b7b6] border-[#b7b7b6] border rounded-lg p-40 border-dashed"
          >
            <FiUploadCloud size={60} color={"#b7b7b6"} />
            <div className="text-[#b7b7b6]">Click to Upload</div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
