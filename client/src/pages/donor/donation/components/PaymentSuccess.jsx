import { useNavigate } from 'react-router-dom';


import { RiInstagramLine } from "react-icons/ri";


function PaymentSuccess() {
    const navigate = useNavigate();

    const handleDonateClick = (event) => {
        event.preventDefault();
        navigate('/')
    };
    return (

        <div className="bg-[#86c88b] h-screen w-full flex items-center justify-center">
            <div className=" bg-[#ffffff] w-110 rounded-lg  shadow-lg mt-4 mb-4 p-10 ">

                <div className="m-5 text-center font-bold text-2xl">Thank you for your Donation!</div>
                <form onSubmit={handleDonateClick}>

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
                            value="Donate"
                        />
                    </div>
                    <div className="mb-4">
                        <a href="https://www.instagram.com/themeenaproject/" className=" font-light text-gray-400 inline-flex items-center vertical-align-middle hover:text-gray-500"> Follow Meena on instagram<RiInstagramLine /></a>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default PaymentSuccess;