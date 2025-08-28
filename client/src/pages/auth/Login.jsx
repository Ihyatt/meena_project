import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import useAuthStore from "src/pages/auth/store";
import logo from "src/assets/images/logo.png";

const Login = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(emailAddress, password)
      .then((success) => {
        if (success) {
          navigate("/admins");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center ">
      <div class="relative flex flex-col rounded-xl bg-transparent center items-center p-10 shadow-lg">
        <img className="w-40" src={logo} alt="meena project logo" />

        <form
          class="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div class="mb-1 flex flex-col gap-6">
            <div class="w-full max-w-sm min-w-[200px]">
              <label class="block mb-2 text-sm text-slate-600">Email</label>
              <input
                type="email"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Your Email"
              />
            </div>
            <div class="w-full max-w-sm min-w-[200px]">
              <label class="block mb-2 text-sm text-slate-600">Password</label>
              <input
                type="password"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
              />
            </div>
          </div>

          <input
            class="
    mt-4 
    w-full
    rounded-sm 
    bg-[#0fa347] 
    py-2 
    px-4 
    border
    border-transparent 
    text-center 
    text-sm 
    text-white 
    transition-all 
    shadow-md
     hover:shadow-lg 
     focus:bg-slate-700
      focus:shadow-none 
      hover:bg-[#2bbd62] 
      active:shadow-none 
      disabled:pointer-events-none 
      disabled:opacity-50
       disabled:shadow-none"
            type="submit"
            value="Login"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
