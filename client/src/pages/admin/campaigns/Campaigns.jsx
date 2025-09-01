import { useEffect, useState, useMemo } from "react";

import { Campaign } from "src/pages/admin/campaigns/Card";

import useCampaignStore from "src/pages/admin/campaigns/store.jsx";

import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "Title",
  "Description",
  "Donations",
  "Raised",
  "Goal",
  "Launched",
  "Closeout Date",
  "Status",
  "",
];

const Campaigns = () => {
  const { fetchCampaigns, campaigns, isLoading } = useCampaignStore();

  useEffect(() => {
    console.log("Fetching campaigns...");
    fetchCampaigns();
    console.log("Campaigns fetched:", campaigns);
  }, [fetchCampaigns]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const totalPages = Math.ceil(campaigns.length / rowsPerPage);

  const currentCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return campaigns.slice(startIndex, endIndex);
  }, [campaigns, currentPage, rowsPerPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  console.log("campaigns", campaigns);

  return (
    <div className=" my-15 mx-10 bg-white shadow-md rounded-lg">
      <Card className="h-full w-full shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none ">
          <div className="ml-4 flex items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              Campaigns
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
              {currentCampaigns.length > 0 ? (
                currentCampaigns.map((campaign, index) => {
                  const isLast = index === currentCampaigns.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return <Campaign key={campaign.id} data={campaign} />;
                })
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      No campaigns to display for this page.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className=" border-blue-gray-50 p-4">
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal opacity-70"
          >
            Page {currentPage} of {totalPages}
          </Typography>
          <div className="flex items-center justify-between mt-2">
            <div className="inline-flex">
              <div
                className="font-normal  cursor-pointer hover:opacity-70 text-gray-800   mr-1 text-sm "
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Prev
              </div>
              <div
                className=" font-normal cursor-pointer hover:opacity-70 text-gray-800  ml-1 text-sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Campaigns;
