import { NumericFormat } from "react-number-format";
import { Link, useLocation } from "react-router-dom";
import useDonorStore from "src/pages/admin/donors/store";

import { RiPencilLine } from "react-icons/ri";

const EmailSubscriptionCard = ({ data }) => {
  console.log(data);
  const manageSubscription = useContext(donorContext).manageSubscription;
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
          className={`py-1 px-2 rounded-md w-max text-xs cursor-pointer  ${data.status == "ACTIVE" ? "bg-green-100 text-green-600 text-xs" : "bg-red-100 text-red-600 text-xs"}`}
        >
          {data.status == "ACTIVE" ? (
            <div
              className="flex items-center gap-1"
              onClick={() => manageSubscription("INACTIVE")}
            >
              subscribed <RiPencilLine />
            </div>
          ) : (
            <div
              className="flex items-center gap-1"
              onClick={() => handleSubscriptionChange("ACTIVE")}
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
