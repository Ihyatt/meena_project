import { NumericFormat } from "react-number-format";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DonationData = ({
  percentage,
  activeCampaign,
  goal,
  raised,
  totalDonations,
  className,
}) => {
  return (
    <div className={`text-lg font-light text-right ${className}`}>
      {activeCampaign == false ? (
        <div className="text-lg font-light text-right">
          <NumericFormat
            value={raised || 0}
            thousandSeparator={true}
            prefix="$"
            decimalScale={2}
            displayType="text"
          />{" "}
          raised
        </div>
      ) : (
        <div className="flex w-full items-center justify-between font-light mb-4">
          <div>
            <div className="text-xl md:text-xl lg:text-lg ">
              <NumericFormat
                value={raised || 0}
                thousandSeparator={true}
                prefix="$"
                decimalScale={2}
                displayType="text"
              />{" "}
              raised
            </div>
            <div className="text-md md:text-lg lg:text-sm text-gray-400 font-light ">
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

          <div className="hidden sm:hidden md:hidden lg:block">
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

          <div className="block md:block lg:hidden">
            <div style={{ width: 80, height: 80, marginLeft: 7 }}>
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
        </div>
      )}
    </div>
  );
};
export default DonationData;
