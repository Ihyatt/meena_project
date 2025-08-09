
import React, { useState } from 'react';

import useEmailStore from 'src/stores/Email'
import Loading from "src/components/Loading";


import { RiInstagramLine } from "react-icons/ri";


const Unsubscribe = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const {
        unsubscribe,
        isLoading,

    } = useEmailStore();


    const handleUnsubscribeClick = (event) => {
        event.preventDefault();
        unsubscribe(emailAddress)
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {isLoading && <Loading />}
            <div className=" w-110 shadow-lg mt-4 mb-4 bg-white rounded-lg">
                <div className="w-full p-10">
                    <div className="pt-2 pb-2 px-7">
                        <div className="m-5 text-center font-bold text-2xl">Unsubscribe</div>
                        <form onSubmit={handleUnsubscribeClick}>
                            <div className="">
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    placeholder="Email"
                                    className='border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
                                />
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
                                    value="Unsubscribe"
                                />
                            </div>
                            <div className="mb-4">
                                <a href="https://www.instagram.com/themeenaproject/" className=" font-light text-gray-400 inline-flex items-center vertical-align-middle hover:text-gray-500"> Follow Meena on instagram<RiInstagramLine /></a>
                            </div>


                        </form>
                    </div>
                </div>
            </div>

        </div >
    )
};
export default Unsubscribe;
