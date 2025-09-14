import { useState, useMemo } from "react";
import DonationCard from "src/pages/admin/donors/components/cards/DonationCard";

import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Amount", "Status", "Date Processed"];

const Donations = ({ donations }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(donations.length / rowsPerPage);

  const currentDonations = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return donations.slice(startIndex, endIndex);
  }, [donations, currentPage, rowsPerPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className=" m-4 bg-white shadow-md rounded-lg">
      <Card className="h-full w-full shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="ml-4 flex items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              Donations
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
              {currentDonations.length > 0 ? (
                currentDonations.map((donation, index) => {
                  const isLast = index === currentDonations.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <DonationCard
                      key={donation.id}
                      data={donation}
                      decoration={{ classes }}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      No donations to display for this page.
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
                className=" cursor-pointer font-normal  hover:opacity-70 text-gray-800   mr-1 text-sm "
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Prev
              </div>
              <div
                className=" cursor-pointer font-normal  hover:opacity-70 text-gray-800  ml-1 text-sm"
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

export default Donations;
