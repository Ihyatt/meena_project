import {
    Typography,
    Chip,
} from "@material-tailwind/react";
import { NumericFormat } from 'react-number-format';


const Donor = ({ data }) => {

    const totalDonated = data.donations.reduce(
        (accumulator, currentValue) => accumulator + parseInt(currentValue.amount),
        0,
    );

    return (
        <tr key={data.id}>
            <td className="p-4 border-b border-blue-gray-50">
                <div className="text-xs ">
                    {data.fullName ? data.fullName : 'NA'}
                </div>

            </td>
            <td className="p-4 border-b border-blue-gray-50">
                <div className="text-xs ">
                    {data.emailAddress ? data.emailAddress : 'NA'}
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
                <div className="text-xs ">
                    {data.donations.length}
                </div>
            </td>
            <td className="p-4 border-b border-blue-gray-50 ">
                <div className="text-xs ">
                    {data.emailSubscription.queued}
                </div>
            </td>
            <td className="p-4 border-b border-blue-gray-50 ">
                <div className="text-xs ">
                    {data.emailSubscription.opened}
                </div>
            </td>
            <td className="p-4 border-b border-blue-gray-50">
                <div className={`py-1 px-2 rounded-md w-max text-xs  ${data.emailSubscription.status == "ACTIVE" ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {data.emailSubscription.status == "ACTIVE" ? "subscribed" : "unsubscribed"}
                </div>
            </td>
        </tr >
    );
};

export default Donor;