import { useEffect, useRef, useState, useMemo } from "react";
import useDonorStore from "src/pages/admin/donors/store";
import FormatDate from "src/components/FormatDate";
import DonationCard from "src/pages/admin/donors/DonationCard";
import EmailSubscriptionCard from "src/pages/admin/donors/EmailSubscriptionCard";

import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

import useAdminStore from "src/pages/admin/store";
import Donor from "src/pages/admin/donors/Card";

const TABLE_HEAD = [
  "Email Address",
  "Queued",
  "Sent",
  "Opened",
  "Blocked",
  "Bounced",
  "Spam",
  "status",
];

const emailSubscription = ({ emailSubscription }) => {
  return (
    <div className=" m-4 bg-white shadow-md rounded-lg">
      <Card className="h-full w-full shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="ml-4 flex items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              Email Subscription
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emailSubscription != {} ? (
                <EmailSubscriptionCard
                  key={emailSubscription.id}
                  data={emailSubscription}
                />
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      No email subscription to display.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className=" border-blue-gray-50 p-4"></CardFooter>
      </Card>
    </div>
  );
};

export default emailSubscription;
