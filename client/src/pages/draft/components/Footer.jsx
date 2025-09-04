import { RiArrowLeftSLine } from "react-icons/ri";

import Progressbar from "src/components/Progressbar";

const Footer = ({ handleSave, progress }) => {
  return (
    <footer className="w-full flex flex-col ">
      <Progressbar progress={progress} />
      <div className=" flex w-full p-10 justify-between">
        <div>
          <RiArrowLeftSLine />
        </div>
        <div className="cursor-pointer"> CONTINUE</div>
      </div>
    </footer>
  );
};
export default Footer;
