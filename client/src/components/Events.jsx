import React, { useState, useEffect } from "react";
import { RiGift2Fill } from "react-icons/ri";
import TimeAgo from "src/pages/admin/utils/TimeAgo";
import { useContext } from "react";

import DonationContext from "src/components/DonationContext";

const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const DonationEvents = () => {
  const [notifications, setNotifications] = useState([]);

  const { handleDonationUpdate } = useContext(DonationContext);

  // This useEffect for initial fetch is fine
  useEffect(() => {
    // Assuming backednUrl is defined elsewhere or passed as a prop
    fetch(`${backednUrl}/events/init`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications);
      })
      .catch((err) => console.error("Initial fetch failed:", err));
  }, []);

  useEffect(() => {
    const source = new EventSource(`${backednUrl}/events/stream`);

    source.addEventListener("donation_notification", (e) => {
      try {
        const data = JSON.parse(e.data);

        // FIX IS HERE: Use the functional update form of setNotifications
        setNotifications((prevNotifications) => {
          // Check for duplicates before adding, if needed
          // For example, if notification_id is unique and you don't want duplicates
          const isDuplicate = prevNotifications.some(
            (note) => note.notification_id === data.notification_id
          );
          if (isDuplicate) {
            console.warn(
              `Duplicate notification received: ${data.notification_id}`
            );
            return prevNotifications; // Return current state if duplicate
          }
          handleDonationUpdate(data.amount);
          if (prevNotifications.length >= 5) {
            // Limit to last 5 notifications
            return [data, ...prevNotifications.slice(0, 4)];
          }
          return [data, ...prevNotifications]; // Add new data to the beginning
        });

        // Acknowledge the notification (this part is fine)
        fetch(`${backednUrl}/events/ack/${data.notification_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notification_id: data.notification_id }),
        }).catch((err) => console.error("ACK failed:", err));
      } catch (err) {
        console.error("Bad JSON from server:", e.data);
      }
    });

    // Add handler for 'connected' event from the server
    source.addEventListener("connected", () => {
      console.log("SSE: Connected to stream.");
    });

    source.onerror = (e) => {
      console.error("SSE error →", e);
      // Optionally close the source on error to prevent infinite retries if not desired
      // source.close();
    };

    return () => {
      console.log("SSE: Closing stream.");
      source.close();
    };
  }, []); // Empty dependency array is correct here for setting up the EventSource once

  return (
    <div className="pt-2 h-90">
      {notifications.length === 0 ? (
        <p className="">No recent donations.</p>
      ) : (
        <ul className=" space-y-2">
          {notifications.map((note) => (
            <li
              key={note.notification_id}
              className="flex items-center rounded-xl pt-2 "
            >
              <div className="rounded-full bg-gray-200 p-2">
                <RiGift2Fill color="black" size={22} />
              </div>
              <div className="ml-4">
                <div className="text-sm">{note.full_name}</div>
                <div className="text-md">
                  ${note.amount} ·{" "}
                  <TimeAgo timestamp={note.donation_created_at} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DonationEvents;
