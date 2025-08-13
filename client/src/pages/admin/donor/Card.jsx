import {
    Typography,
    Chip,
} from "@material-tailwind/react";
import { NumericFormat } from 'react-number-format';


const Donor = ({ data }) => {
    return (
        <tr key={data.id}>
            <td className="p-4 border-b border-blue-gray-50">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {data.fullName ? data.fullName : 'NA'}
                </Typography>

            </td>
            <td className="p-4 border-b border-blue-gray-50">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {data.emailAddress ? data.emailAddress : 'NA'}
                </Typography>

            </td>
            <td className="p-4 border-b border-blue-gray-50">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    <NumericFormat
                        value={data.totalDonated}
                        thousandSeparator={true}
                        prefix="$"
                        decimalScale={2}
                        displayType="text"
                    /> {' '}
                </Typography>
            </td>

            <td className="p-4 border-b border-blue-gray-50">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {data.totalDonations}
                </Typography>
            </td>
            <td className="p-4 border-b border-blue-gray-50 ">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {data.emailsQueued}
                </Typography>
            </td>
            <td className="p-4 border-b border-blue-gray-50 ">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {data.emailsOpened}
                </Typography>
            </td>
            <td className="p-4 border-b border-blue-gray-50">
                <div className="w-max ">
                    <Chip
                        variant="ghost"
                        size="sm"
                        value={data.subscribed ? "subscribed" : "unsubscribed"}
                        className={`font-normal ${data.subscribed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    />
                </div>
            </td>
        </tr>
    );
};

export default Donor;