import { useContext } from "react";
import DonorContext from "src/pages/admin/donors/DonorContext";

import { RiPencilLine } from "react-icons/ri";

const EmailSubscriptionCard = ({ data }) => {
  const { handleSubscriptionChange, emailSubscriptionStatus } =
    useContext(DonorContext);
  return (
    <tr key={data.id}>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.emailAddress}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.queued}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.sent}</div>
      </td>

      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.opened}</div>
      </td>

      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">
          {data.blocked ? "Marked as Blocked" : "NA"}
        </div>
      </td>

      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.bounced}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.spam ? "Marked as Spam" : "NA"}</div>
      </td>

      <td className="p-4 border-b border-blue-gray-50">
        <div
          className={`py-1 px-2 rounded-md w-max text-xs cursor-pointer  ${emailSubscriptionStatus == "active" ? "bg-green-100 text-green-600 text-xs" : "bg-red-100 text-red-600 text-xs"}`}
        >
          {emailSubscriptionStatus == "active" ? (
            <div
              className="flex items-center gap-1"
              onClick={() => handleSubscriptionChange("inactive")}
            >
              subscribed <RiPencilLine />
            </div>
          ) : (
            <div
              className="flex items-center gap-1"
              onClick={() => handleSubscriptionChange("active")}
            >
              unsubscribed <RiPencilLine />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EmailSubscriptionCard;
