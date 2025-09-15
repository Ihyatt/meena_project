import { FaArrowTrendUp } from "react-icons/fa6";
import {
  RiHandHeartFill,
  RiMegaphoneFill,
  RiMoneyDollarCircleFill,
  RiUserHeartFill,
} from "react-icons/ri";

import { NumericFormat } from "react-number-format";

const Header = ({ launchedCampaigns, donationsCount, raised, donorsCount }) => {
  return (
    <>
      <div
        className="grid grid-cols-1 content-center justify-items-center rounded-lg shadow-sm h-20 "
        style={{ backgroundColor: "#edafb0", color: "#40bf51" }}
      >
        <div className="flex items-center space-x-2">
          <RiMegaphoneFill
            size={25}
            color={"#edafb0"}
            className="inline bg-white rounded-xl p-1"
          />{" "}
          <span className="text-xl text-white">{launchedCampaigns}</span>
        </div>
        <div className="text-white">CAMPAIGNS</div>
      </div>
      <div
        className="grid grid-cols-1 content-center justify-items-center rounded-lg shadow-sm h-20 "
        style={{ backgroundColor: "#edafb0", color: "white" }}
      >
        <div className="flex items-center space-x-2">
          <RiHandHeartFill
            size={25}
            color={"#edafb0"}
            className="inline bg-white rounded-xl p-1"
          />{" "}
          <span className="text-xl">{donationsCount || 0}</span>
        </div>
        <div className="text-white">DONATIONS</div>
      </div>
      <div
        className=" grid grid-cols-1 content-center justify-items-center text-black rounded-lg shadow-sm h-20 "
        style={{ backgroundColor: "#edafb0", color: "white" }}
      >
        <div className="flex items-center space-x-1">
          <RiMoneyDollarCircleFill
            size={30}
            color={"white"}
            className="inline  rounded-xl"
          />
          <span className="text-xl">
            <NumericFormat
              value={raised || 0}
              thousandSeparator={true}
              prefix="$"
              decimalScale={2}
              displayType="text"
            />
          </span>
        </div>
        <div className="text-white">RAISED</div>
      </div>
      <div
        className=" grid grid-cols-1 content-center justify-items-center text-black rounded-lg  shadow-sm min-h-20 "
        style={{ backgroundColor: "#edafb0", color: "white" }}
      >
        <div className="flex items-center space-x-2">
          <RiUserHeartFill
            size={25}
            color={"#edafb0"}
            className="inline bg-white rounded-xl p-1"
          />{" "}
          <span className="text-xl">{donorsCount}</span>
        </div>
        <div className="text-white">DONORS</div>
      </div>
    </>
  );
};
export default Header;
