// External Libraries
import { NumericFormat } from "react-number-format";
import EllipsisText from "react-ellipsis-text";
import { Link, useLocation } from "react-router-dom";

// UI Libraries (Material Tailwind)
import { Chip } from "@material-tailwind/react";
import { RiPencilLine } from "react-icons/ri";

// Local Components
import FormatDate from "src/components/FormatDate";
import useCampaignStore from "src/pages/admin/campaigns/store.jsx";

export const Campaign = ({ data }) => {
  const { launchCampaign, closeCampaign } = useCampaignStore();

  const handleLaunchClick = () => {
    launchCampaign(data.id);
  };

  const handleCloseClick = () => {
    closeCampaign(data.id);
  };

  return (
    <tr key={data.id}>
      <td className="max-w-60 break-all p-4 border-b border-blue-gray-50">
        <div className="flex items-center gap-4">
          <img src={data.imageUrl} className="h-10 rounded-lg object-cover" />
          <div className="text-xs ">{data.title}</div>
        </div>
      </td>
      <td className="max-w-40 p-4 border-b  break-all border-blue-gray-50 text-xs ">
        <EllipsisText text={data.description} length={"60"} />
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.totalDonations}</div>
      </td>

      <td className="p-4 border-b border-blue-gray-50 text-xs ">
        <NumericFormat
          value={data.raised}
          thousandSeparator={true}
          prefix="$"
          decimalScale={2}
          displayType="text"
          className="text-xs"
        />
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-xs">
        <NumericFormat
          value={data.goal}
          thousandSeparator={true}
          prefix="$"
          decimalScale={2}
          displayType="text"
          className="text-xs"
        />
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-xs ">
        <div className="text-xs">
          {data.launched ? <FormatDate date={data.launched} /> : "N/A"}
        </div>
      </td>

      <td className="p-4 border-b border-blue-gray-50 text-xs ">
        <div className="text-xs">
          {data.closeoutDate ? <FormatDate date={data.closeoutDate} /> : "N/A"}
        </div>
      </td>

      <td className="p-4 border-b border-blue-gray-50 text-xs ">
        <div className="w-max ">
          {data.isActive ? (
            <div
              className="bg-green-100 text-green-600 px-3 py-2 rounded-full cursor-pointer"
              onClick={handleCloseClick}
            >
              close
            </div>
          ) : (
            <div
              className="bg-red-100 text-red-600 px-3 py-2 rounded-full cursor-pointer"
              onClick={handleLaunchClick}
            >
              launch
            </div>
          )}
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50  ">
        <Link
          to={`/campaigns/${data.id}`}
          className="w-full h-full px-2 py-1.5 text-sm  flex items-center"
        >
          <RiPencilLine />
        </Link>
      </td>
    </tr>
  );
};
