import { Link } from "react-router-dom";

export const TermsOfService = () => {
  return (
    <div
      className="text-sm font-light 
            text-gray-400 
            items-center 
            vertical-align-middle 
            cursor-pointer
            mb-4
            "
    >
      <span> By clicking ‘Donate‘, you agree to Meena Projects’s </span>
      <Link
        to={"terms"}
        className="ml-1 underline hover:no-underline text-gray-600"
      >
        Terms of Service
      </Link>
      .
    </div>
  );
};
export default TermsOfService;
