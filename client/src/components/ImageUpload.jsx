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
          className="cursor-pointer flex flex-col items-center justify-center text-gray-300"
        >
          <FiUploadCloud size={60} />
          <div>Click to Upload</div>
        </label>
      </div>

      {imageUrl && (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-sm hover:underline"
        >
          view uploaded image
        </a>
      )}
    </div>
  );
};

export default ImageUpload;
