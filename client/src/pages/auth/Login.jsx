import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'src/stores/Auth';

const Login = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(emailAddress, password);
    if (success) {
      navigate('/admins');
    }
  };

  return (
    <div className="grid grid-cols-9 gap-4 items-center justify-center h-screen">
      <div className=" col-start-4 col-span-3 shadow-lg mt-4 mb-4">
        <div className="w-full p-10">
          <div className="pt-2 pb-7 px-7">
            <div className="m-5 text-center font-bold text-2xl">Login</div>
            <form onSubmit={handleSubmit}>
              <div className="">
                <input
                  type="email"
                  id="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Email"
                  className='border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
                />
              </div>
              <div className="">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className=' border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
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
                  value="Login"
                />
              </div>


            </form>
          </div>
        </div>
      </div>

    </div >
  );
};

export default Login;