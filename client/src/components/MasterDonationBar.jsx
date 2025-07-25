
const MasterDonationBar = ({ raised, goal }) => {
    const progressPercentage = goal > 0
        ? (raised / goal) * 100
        : 0;

    const clampedPercentage = Math.min(100, Math.max(0, progressPercentage));

    return (
        <div className='rounded-lg w-full h-6 bg-gray-200 overflow-hidden'>
            <div
                style={{ width: `${clampedPercentage}%` }}
                className='bg-[#DB5758] h-full transition-all duration-500 ease-in-out'
            >
            </div>
        </div>
    );
};

export default MasterDonationBar;