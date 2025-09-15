import React, { useState } from "react";
import { ABOUT_MEENA } from "src/utils/constants";

const About = ({ description }) => {
  const [toggleText, setToggleText] = useState("about");

  const handleClick = (type) => {
    setToggleText(type);
  };
  return (
    <>
      <div className="flex justify-start pb-6 px-4 ">
        <div
          onClick={() => handleClick("about")}
          className={`
            font-medium
            py-3
            cursor-pointer
            mr-2
            w-fit
            ${
              toggleText == "about"
                ? "text-black border-b-2 border-black transition-colors duration-300"
                : "text-[#0fa347]"
            }
        `}
        >
          WHO WE ARE
        </div>
        <div
          onClick={() => handleClick("campaign")}
          className={`
                font-medium
                w-fit
                py-3
                ml-2
                cursor-pointer
                ${
                  toggleText == "campaign"
                    ? "text-black border-b-2 border-black  transition-colors duration-300"
                    : "text-[#0fa347]"
                }
            `}
        >
          OUR GOAL
        </div>
      </div>
      <div className="font-light whitespace-pre-wrap px-4">
        {toggleText == "about" ? ABOUT_MEENA : description}
      </div>
    </>
  );
};
export default About;
