

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import useDonorStore from 'src/stores/Donor'
import Loading from "src/components/Loading";
import { RiInstagramLine } from "react-icons/ri";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import defaultImg from 'src/assets/images/defaultImg.jpg';



import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    IconButton,
} from "@material-tailwind/react";

const Subscription = () => {
    const navigate = useNavigate();

    const {
        fullName,
        setFullName,
        setAmount,
        emailAddress,
        setLat,
        setLng,
        setActiveButton,
        activeButton,
        setEmailAddress,
        setIsAnonymous,
        isAnonymous,
        fetchCampaign,
        isLoading,
        setSubscribed,
        subscribed,
        campaign,

    } = useDonorStore();
    const [open, setOpen] = useState(false);
    const [agreement, setAgreement] = useState(false);

    useEffect(() => {
        fetchCampaign()
    }, [fetchCampaign]);

    const handleClick = (buttonId, amount) => {
        setActiveButton(buttonId);
        setAmount(amount)
    };

    const handleSubscriptionClick = () => {
        navigate(`/checkout`);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };


    return (
        <div>
            {isLoading && <Loading />}
            <div className="bg-[#86c88b]">
                <div className=" flex justify-center w-full mt-16 ">
                    <div className=" w-110 rounded-lg  shadow-lg mt-4 mb-4 ">
                        <div className="rounded-lg  w-full">
                            <img
                                src={defaultImg}
                                alt="ui/ux review check"
                                className='rounded-t-lg shadow-none  h-100 w-full object-cover'
                            />
                            <div className="pt-2 pb-7 px-8 bg-white rounded-b-lg ">
                                <div className="text-2xl font-bold">
                                    Select a Gift Amount
                                </div>

                                <div className="mb-3 text-gray-400">
                                    _ _ _
                                </div>
                                <form onSubmit={handleSubscriptionClick}>
                                    <div>Monthly Subscription Plans</div>
                                    <div className="flex gap-5 my-[25px] transition-all duration-300 ease-in-out" id="amountSelector">
                                        <button
                                            type="button"
                                            className={
                                                `
                                            font-medium
                                            text-base
                                            flex-1
                                            p-2
                                            border
                                            border-[#cecfdb]
                                            rounded
                                            text-gray-800
                                            cursor-pointer
                                            ${activeButton === 'button1' ?
                                                    'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                                                    : ''}
                                            `
                                            }
                                            onClick={() => handleClick('button1', 15)}
                                        >
                                            $15</button>
                                        <button
                                            type="button"
                                            className={
                                                `
                                            font-medium
                                            text-base
                                            flex-1
                                            p-2
                                            border
                                            border-[#cecfdb]
                                            rounded
                                            text-gray-800
                                            cursor-pointer
                                            ${activeButton === 'button2' ?
                                                    'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                                                    : ''}
                                            `
                                            }
                                            onClick={() => handleClick('button2', 30)}
                                        >
                                            $30</button>
                                        <button
                                            type="button"
                                            className={
                                                `
                                                font-medium
                                                text-base
                                                flex-1
                                                p-2
                                                border
                                                border-[#cecfdb]
                                                rounded
                                                text-gray-800
                                                cursor-pointer
                                                ${activeButton === 'button3' ?
                                                    'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                                                    : ''}
                                                `
                                            }
                                            onClick={() => handleClick('button3', 100)}
                                        >
                                            $100
                                        </button>
                                        <button
                                            type="button"
                                            className={
                                                `
                                                font-medium
                                                text-base
                                                flex-1
                                                p-2
                                                border
                                                border-[#cecfdb]
                                                rounded
                                                text-gray-800
                                                cursor-pointer
                                                ${activeButton === 'button4' ?
                                                    'bg-[#DB5758] text-white border-none hover:bg-[#D22D2E] hover:text-white hover:border-none transition-colors duration-300'
                                                    : ''}
                                            `
                                            }
                                            onClick={() => handleClick('button4', 500)}
                                        >
                                            $500
                                        </button>
                                    </div>
                                    <div className="mt-4 mb-5">
                                        <div className=" flex m-2 text-sm text-gray-400 font-light">
                                            <div className="inline-flex items-center mr-1">
                                                <label className="flex items-center cursor-pointer relative">
                                                    <input
                                                        checked={agreement}
                                                        onChange={setAgreement}
                                                        type="checkbox"
                                                        className="peer h-3.5 w-3.5 cursor-pointer transition-all appearance-none rounded  hover:shadow-sm border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check-custom-icon" />
                                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                        </svg>
                                                    </span>
                                                </label>
                                            </div>
                                            I accept and agree to the  <div className="ml-1 inline font-semibold cursor-pointer hover:underline" onClick={handleOpen}>terms and conditions</div>
                                            {
                                                open && <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                                            Terms and Conditions
                                                        </Typography>
                                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                                            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                                            sunt in culpa qui officia deserunt mollit anim id est laborum.
                                                        </Typography>
                                                    </Box>
                                                </Modal>}
                                        </div>
                                    </div>
                                    <div className="my-6">
                                        <input
                                            className="
                                                font-medium                 
                                                text-base                  
                                                max-w-[400px]               
                                                w-full                      
                                                p-[15px]                    
                                                bg-[#DB5758]                 
                                                text-white                   
                                                border-none                  
                                                rounded                    
                                                cursor-pointer               
                                                transition-colors           
                                                duration-300                 
                                                my-[10px]                    
                                                block                        
                                                mx-auto                      
                                                hover:bg-[#D22D2E]           
                                                "
                                            type="submit" name=""
                                            value="Subscribe"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <a href="https://www.instagram.com/themeenaproject/" className=" font-light text-gray-400 inline-flex items-center vertical-align-middle hover:text-gray-500"> Follow Meena on instagram<RiInstagramLine /></a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
};
export default Subscription;