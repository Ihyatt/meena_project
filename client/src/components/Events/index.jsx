import useEvents from "src/components/Events/hooks/useEvents.jsx";
import NotificationCard from "src/components/Events/NotificationCard";

const DonationEvents = ({ handleNewDonation, handleDonorUpdate }) => {
  const { notifications } = useEvents(handleNewDonation);
  return (
    <>
      <div className="text-gray-400 ">RECENT DONATIONS</div>
      <div className="pt-2 h-80">
        {notifications.length === 0 ? (
          <p className="">No recent donations.</p>
        ) : (
          <ul className=" space-y-2">
            {notifications.map((note) => (
              <NotificationCard
                key={note.notification_id}
                notification={note}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default DonationEvents;
