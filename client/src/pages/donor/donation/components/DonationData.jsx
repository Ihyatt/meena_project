import { NumericFormat } from "react-number-format";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const DonationData = ({ goal, raised, totalDonations }) => {
  const percentage = 66;

  return (
    <div className="flex w-full items-center justify-between font-light mb-5">
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
        <div className="text-md text-gray-400 font-light text-sm">
          <NumericFormat
            value={goal}
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
      <div style={{ width: 70, height: 70, marginLeft: 7 }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={{
            path: {
              stroke: `rgba(13, 133, 58, ${percentage / 100})`,
              strokeLinecap: "round",
              transformOrigin: "center center",
            },

            text: {
              // Text color
              fill: "#949996",
              // Text size
              fontSize: "16px",
            },
          }}
        />
      </div>
    </div>
  );
};
export default DonationData;
