import DonationBar from 'src/components/DonationBar';
import { CampaignDropdown } from "src/pages/admin/components/CampaignDropdown"
import "src/assets/css/Carousel.css";
import { NumericFormat } from 'react-number-format';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
} from "@material-tailwind/react";


export const Campaign = ({ data }) => {

  return (
    <Card className=" h-70 w-full max-w-[26rem]  shadow-none flex flex-col border border-solid border-gray-100 ">
      <CardHeader floated={false} color="" className='shadow-none m-0'>
        <img
          src={data.imageUrl}
          alt="ui/ux review check"
          className='shadow-none'
        />
        <div className="to-bg-black-10 absolute inset-0 w-full" />
        <IconButton
          className="!absolute top-4 right-4 shadow-none border-2 border-solid border-white opacity-70 hover:opacity-100"
        >
          <CampaignDropdown data={data} />
        </IconButton>
      </CardHeader>

      <CardBody className="p-0">
        <div className="m-3 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="font-medium ">
            {data.title}
          </Typography>
        </div>
      </CardBody>

      <CardFooter className="p-0 pt-3">
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
          <div className='text-xs text-gray-400 font-light'>
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
        </div>
        <DonationBar
          raised={data.raised}
          goal={data.goal}
        />
      </CardFooter>
    </Card>
  );
}

