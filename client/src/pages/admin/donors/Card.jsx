import { NumericFormat } from "react-number-format";
import { Link, useLocation } from "react-router-dom";

import { RiPencilLine } from "react-icons/ri";

const Donor = ({ data }) => {
  const totalDonated = data.donations.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.amount),
    0
  );
  const location = useLocation();
  return (
    <tr key={data.id}>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.fullName ? data.fullName : "NA"}</div>
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
        <div className="text-xs ">{data.donations.length}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50 ">
        <div className="text-xs ">{data.emailSubscription.sent}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50 ">
        <div className="text-xs ">{data.emailSubscription.opened}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div
          className={`py-1 px-2 rounded-md w-max text-xs  ${data.emailSubscription.status == "ACTIVE" ? "bg-green-100 text-green-600 text-xs" : "bg-red-100 text-red-600 text-xs"}`}
        >
          {data.emailSubscription.status == "ACTIVE"
            ? "subscribed"
            : "unsubscribed"}
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50  ">
        <Link
          to={`/admins/donors/${data.id}`}
          state={{ background: location }}
          className="w-full h-full px-2 py-1.5 text-sm  flex items-center"
        >
          <RiPencilLine />
        </Link>
      </td>
    </tr>
  );
};

export default Donor;
