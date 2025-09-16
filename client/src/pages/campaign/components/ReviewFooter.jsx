import ShareButton from "src/pages/campaign/components/ShareButton";
import Progressbar from "src/components/Progressbar";

import { FUNDING_STEP } from "src/utils/Constants";

const ReviewFooter = ({ progressStep }) => {
  return (
    <>
      <footer className="w-full flex flex-col ">
        <Progressbar progress={(progressStep / FUNDING_STEP) * 100} />
        <div className=" flex w-full p-10 justify-end items-center">
          <div>
            <ShareButton>SHARE</ShareButton>
          </div>
        </div>
      </footer>
    </>
  );
};
export default ReviewFooter;
