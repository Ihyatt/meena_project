import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FiUploadCloud } from "react-icons/fi";
import useAdminStore from "src/stores/Campaign";



const ImageUpload = ({ campaignId }) => {
    const [file, setFile] = useState(null);
    const { upload, imageUrl } = useAdminStore();


    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            setFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            upload(campaignId, file)

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
                    style={{ display: 'none' }}
                    accept="image/*"
                />

                <label htmlFor="hiddenFileInput" onClick={handleIconClick} className='cursor-pointer flex flex-col items-center justify-center text-gray-300'>
                    <FiUploadCloud size={60} />
                    <div>Click to Upload</div>
                </label>
            </div>

            {imageUrl && (
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline' >
                    view uploaded image
                </a>
            )}
        </div>
    );
};


export default ImageUpload;