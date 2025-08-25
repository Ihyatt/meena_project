
const DonationBar = ({ raised, goal }) => {
    const progressPercentage = goal > 0
        ? (raised / goal) * 100
        : 0;

    const clampedPercentage = Math.min(100, Math.max(0, progressPercentage));
    return (
        <div className=' w-full h-2 bg-gray-200 overflow-hidden rounded-full'>
            <div
                style={{ width: `${clampedPercentage}%` }}
                className='bg-[#DB5758] h-full transition-all duration-500 ease-in-out '
            >
            </div>
        </div>
    );
};

export default DonationBar;