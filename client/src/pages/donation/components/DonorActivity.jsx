import { FaArrowTrendUp } from "react-icons/fa6";

const DonorActivity = ({ donorsCount }) => {
  return (
    <>
      {donorsCount > 0 && (
        <div className="flex justify-start items-center mt-5 mb-3">
          <FaArrowTrendUp
            size={35}
            color="#DB5758"
            className="inline bg-[#edafb0] rounded-full p-1"
          />{" "}
          <div className="text-sm font-bold  ml-3 text-[#DB5758]">
            {donorsCount} {donorsCount == 1 ? "person " : "people "}
            just donated
          </div>
        </div>
      )}
    </>
  );
};
export default DonorActivity;
