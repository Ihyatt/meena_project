import { CampaignDropdown } from "src/pages/admin/campaigns/CardDropdown"
import { NumericFormat } from 'react-number-format';
import DonationBar from 'src/pages/admin/donation/ProgressBar';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";

export const Campaign = ({ data }) => {

  return (

    <tr key={data.id}>
      <td className="p-4 border-b border-blue-gray-50">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {data.title}
        </Typography>

      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {data.description}
        </Typography>

      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {data.totalDonations}
        </Typography>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          <NumericFormat
            value={data.goal}
            thousandSeparator={true}
            prefix="$"
            decimalScale={2}
            displayType="text"
          /> {' '}
        </Typography>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          <NumericFormat
            value={data.raised}
            thousandSeparator={true}
            prefix="$"
            decimalScale={2}
            displayType="text"
          /> {' '}
        </Typography>
      </td>


      <td className="p-4 border-b border-blue-gray-50 ">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {data.launched}
        </Typography>
      </td>

      <td className="p-4 border-b border-blue-gray-50 ">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {data.closed}
        </Typography>
      </td>

      <td className="p-4 border-b border-blue-gray-50">
        <div className="w-max ">
          <Chip
            variant="ghost"
            size="sm"
            value={data.isActive ? "active" : "inactive"}
            className={`font-normal ${data.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
          />
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50 ">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          pencil
        </Typography>
      </td>
    </tr>

  );
}

