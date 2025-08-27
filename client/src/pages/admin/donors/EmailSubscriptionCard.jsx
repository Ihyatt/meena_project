import { NumericFormat } from "react-number-format";
import { Link, useLocation } from "react-router-dom";

import { RiPencilLine } from "react-icons/ri";

const EmailSubscriptionCard = ({ data }) => {
  console.log(data);
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
        <div className="text-xs ">{data.blocked}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.fullName ? data.fullName : "NA"}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.bounced}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.spam}</div>
      </td>

      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">
          {data.emailAddress ? data.emailAddress : "NA"}
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">
          <NumericFormat
            value={totalDonated}
            thousandSeparator={true}
            prefix="$"
            decimalScale={2}
            displayType="text"
          />
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div
          className={`py-1 px-2 rounded-md w-max text-xs  ${data.status == "ACTIVE" ? "bg-green-100 text-green-600 text-xs" : "bg-red-100 text-red-600 text-xs"}`}
        >
          {data.emailSubscription.status == "ACTIVE" ? (
            <div>
              "subscribed" <RiPencilLine />{" "}
            </div>
          ) : (
            <div>
              "unsubscribed" <RiPencilLine />{" "}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EmailSubscriptionCard;
