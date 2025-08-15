import { CampaignDropdown } from "src/pages/admin/campaigns/CardDropdown"
import { NumericFormat } from 'react-number-format';
import EllipsisText from "react-ellipsis-text";
import FormatDate from "src/components/FormatDate";



import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Chip,

} from "@material-tailwind/react";
import { RiPencilLine } from "react-icons/ri";


export const Campaign = ({ data }) => {


  console.log(data)

  return (

    <tr key={data.id}>
      <td className="max-w-60 break-all p-4 border-b border-blue-gray-50" >
        <div className="flex items-center gap-4">
          <img
            src={data.imageUrl}
            className="h-10 rounded-lg object-cover"
          />
          <div className="text-xs ">
            {data.title}
          </div></div>

      </td>
      <td className="max-w-40 p-4 border-b  break-all border-blue-gray-50 text-xs ">
        <EllipsisText text={data.description} length={"60"} />
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">
          {data.totalDonations}
        </div>
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

        <NumericFormat
          value={data.raised}
          thousandSeparator={true}
          prefix="$"
          decimalScale={2}
          displayType="text"
          className="text-xs"
        />
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-xs ">
        <div className="text-xs">{data.launched ? <FormatDate date={data.launched} /> : "N/A"}</div>
      </td>

      <td className="p-4 border-b border-blue-gray-50 text-xs ">
        <div className="text-xs">
          {data.closed ? <FormatDate date={data.closed} /> : "N/A"}
        </div>
      </td>

      <td className="p-4 border-b border-blue-gray-50 text-xs ">
        <div className="w-max ">
          <Chip
            variant="ghost"
            size="sm"
            value={data.isActive ? "active" : "inactive"}
            className={`font-normal ${data.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
          />
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50  ">

        <CampaignDropdown key={data.id} data={data} />
      </td>
    </tr>

  );
}

