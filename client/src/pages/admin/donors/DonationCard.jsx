import FormatDate from "src/components/FormatDate";

const DonationCard = ({ data }) => {
  return (
    <tr key={data.id}>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.amount}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">{data.status}</div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="text-xs ">
          <FormatDate date={data.createdAt} />
        </div>
      </td>
    </tr>
  );
};
export default DonationCard;
