import { NumericFormat } from "react-number-format";
import DonationBar from "src/pages/donor/donation/components/DonationBar";

const DonationData = ({ goal, raised, totalDonations }) => {
  return (
    <div className="flex w-58 flex-col mt-10 mb-5 font-light">
      <div>
        <div className="text-lg">
          <NumericFormat
            value={raised || 0}
            thousandSeparator={true}
            prefix="$"
            decimalScale={2}
            displayType="text"
          />{" "}
          raised
        </div>
        <div className="text-md text-gray-400 font-light">
          <NumericFormat
            value={goal || 100}
            thousandSeparator={true}
            prefix="$"
            decimalScale={2}
            displayType="text"
          />{" "}
          goal ·{" "}
          <NumericFormat
            value={totalDonations}
            thousandSeparator={true}
            displayType="text"
          />{" "}
          donations
        </div>
      </div>
      <div className="mt-2 mb-1">
        <DonationBar raised={raised || 0} goal={goal || 0} />
      </div>
    </div>
  );
};
export default DonationData;
