import { CampaignDropdown } from "src/pages/admin/components/campaign/Dropdown"
import { NumericFormat } from 'react-number-format';
import DonationBar from 'src/pages/admin/components/donation/ProgressBar';

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
    <Card className="w-full max-w-[26rem] shadow-sm">
      <CardHeader floated={false} className="rounded-t-lg shadow-none rounded-b-none mt-0" >
        <img
          src={data.imageUrl}
          alt="campaign image"
        />
        <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
        <IconButton
          className="!absolute top-4 right-4 rounded-full p-3 shadow-none border-2 border-solid border-white opacity-70 hover:opacity-100"
        >
          <CampaignDropdown data={data} />
        </IconButton>
      </CardHeader>
      <CardBody>
        <div className="m-3 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="font-medium ">
            {data.title}
          </Typography>
        </div>
      </CardBody>
      <CardFooter className="pt-3">
        <div className='m-3'>
          <div className="text-sm flex items-center text-gray-800 font-semibold">
            <div>
              <NumericFormat
                value={data.raised}
                thousandSeparator={true}
                prefix="$"
                decimalScale={2}
                displayType="text"
              /> {' '}raised
            </div>
            {data.isActive &&
              <span className="relative flex size-3 m-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
              </span>
            }

          </div>
          <div className='text-xs text-gray-400 font-light mb-1'>
            <NumericFormat
              value={data.goal}
              thousandSeparator={true}
              prefix="$"
              decimalScale={2}
              displayType="text"
            />{' '}goal ·
            <NumericFormat
              value={data.totalDonations}
              thousandSeparator={true}
              displayType="text"
            /> {' '} donations
          </div>
          <DonationBar
            raised={data.raised}
            goal={data.goal}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

