import { Link } from "react-router-dom";

import logo from "src/assets/images/logo.png";

export const Header = () => {
  return (
    <div className=" mt-10 mb-19 md:px-10  lg:px-10 xl:px-10 2xl:px-10   ">
      <div className=" w-full flex  items-center justify-between  ">
        <div></div>
        <img src={logo} alt="Logo" className="h-10" />
        <div>
          {" "}
          <Link to={"/login"} className=" cursor-pointer ">
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};
