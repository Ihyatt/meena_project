import PreviousButton from "src/pages/campaign/components/PreviousButton.jsx";
import ContinueButton from "src/pages/campaign/components/ContinueButton.jsx";
import Progressbar from "src/components/Progressbar";

import { FUNDING_STEP } from "src/utils/Constants";

const Footer = ({ progressStep, isButtonDisabled }) => {
  return (
    <>
      <footer className="w-full flex flex-col ">
        <Progressbar progress={(progressStep / FUNDING_STEP) * 100} />
        <div className=" flex w-full p-10 justify-between items-center">
          <PreviousButton />
          <div>
            {isButtonDisabled ? (
              <ContinueButton
                className="  
                bg-[#d8d8d8] text-slate-700  pointer-events-none cursor-not-allowed"
              >
                CONTINUE
              </ContinueButton>
            ) : (
              <ContinueButton
                className="cursor-pointer
                text-white bg-[#0fa347] hover:bg-[#2bbd62]"
              >
                CONTINUE
              </ContinueButton>
            )}
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
