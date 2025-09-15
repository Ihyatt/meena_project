// 1. React imports

// 2. External library imports
import { RiGift2Line } from "react-icons/ri";
import TimeAgo from "src/utils/TimeAgo"; // This is likely an external or shared component

// 3. Context/Utility imports

// 4. Environment variables

const NotificationCard = ({ notification }) => {
  return (
    <>
      <li
        key={notification.notification_id}
        className="flex items-center rounded-xl pt-2 "
      >
        <div className="rounded-full bg-gray-200 p-2">
          <RiGift2Line color="black" size={22} />
        </div>
        <div className="ml-4">
          <div className="text-sm">{notification.full_name}</div>
          <div className="text-md">
            ${notification.amount} ·{" "}
            <TimeAgo timestamp={notification.donation_created_at} />
          </div>
        </div>
      </li>
    </>
  );
};
export default NotificationCard;
