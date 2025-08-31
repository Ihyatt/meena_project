import React, { useState, useMemo } from "react";

import { NumericFormat } from "react-number-format";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DonationData = ({ goal, raised, totalDonations }) => {
  // useMemo will only recalculate the percentage if 'raised' or 'goal' changes
  const percentage = useMemo(() => {
    if (goal === 0) return 0; // Avoid division by zero
    return Math.min(Math.floor((raised / goal) * 100), 100); // Cap at 100%
  }, [raised, goal]); // Dependency array: the "anchor points"

  return (
    <div className="flex w-full items-center justify-between font-light mb-4">
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
