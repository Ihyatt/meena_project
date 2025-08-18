import React, { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import useAuthStore from 'src/pages/auth/store';



const Login = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();


  const handleSubmit = async (e) => {
    e.preventDefault();
    login(emailAddress, password).then((success) => {
      console.log('Login successful:', success);
      if (success) {
        navigate('/admins');
      }
    }).catch((error) => {
      console.error('Login failed:', error);
    });
  };

  return (
    <div className="bg-[#86c88b] h-screen w-full flex items-center justify-center">
      <div className=" bg-[#ffffff] w-110 rounded-lg  shadow-lg mt-4 mb-4 p-6 ">
        <div className="m-5 text-center font-bold text-2xl">Login</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Email"
            className='border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className=' border-b border-gray-400 w-full p-2 mb-2 focus:outline-none'
          />
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
  );
};

export default Login;