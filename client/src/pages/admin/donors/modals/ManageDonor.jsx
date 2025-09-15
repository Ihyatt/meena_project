// External Stylesheets
import "src/assets/css/Modal.css";

// Local Components
import ErrorAlert from "src/components/ErrorAlert";
import EmailSubscription from "src/pages/admin/donors/components/EmailSubscription";
import Loading from "src/components/Loading";
import Donations from "src/pages/admin/donors/components/Donations.jsx";

// State Management
import useDonor from "src/pages/admin/donors/hooks/useDonor";

export const ManageDonor = () => {
  const {
    modalRef,
    errors,
    donations,
    toggle,
    fullName,
    emailAddress,
    isLoading,
    setFullName,
    handleClose,
    handleSave,
    handleErrorClose,
    handleTableDisplay,
  } = useDonor();
  return (
    <div ref={modalRef} className="modal-wrapper">
      {isLoading && <Loading />}
      <div className="modal rounded-lg">
        <form className=" mx-auto p-5">
          <div className="flex ">
            <div className="p-2">
              <label className="block mb-2 text-sm text-slate-600">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
                required
              />
            </div>
            <div className="p-2">
              <label className="block mb-2 text-sm text-slate-600">
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                placeholder="Email Address"
                disabled
                value={emailAddress}
                className="w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow cursor-not-allowed "
              ></input>
            </div>
          </div>

          <div className="inline-flex pt-6 pl-3">
            <div
              className={`bg-gray-100 hover:bg-gray-200 text-gray-800  py-2 px-4 rounded-l text-sm ${toggle == "donations" ? "bg-gray-200 text-gray-800" : ""} `}
              onClick={handleTableDisplay("donations")}
            >
              Donations
            </div>
            <div
              className={`bg-gray-100 hover:bg-gray-200 text-gray-800  py-2 px-4 rounded-r text-sm ${toggle == "emailSubscription" ? "bg-gray-200 text-gray-800" : ""} `}
              onClick={handleTableDisplay("emailSubscription")}
            >
              Email Subscription
            </div>
          </div>
          {toggle == "donations" ? (
            <Donations donations={donations} />
          ) : (
            <EmailSubscription />
          )}

          <div className="flex  justify-end mt-4">
            <button
              type="button"
              className="text-white bg-gray-400 focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-gray-300 "
              onClick={handleClose}
              disabled={isLoading}
            >
              Close
            </button>
            <button
              type="button"
              className="text-white bg-[#0fa347]  focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-[#2bbd62] "
              onClick={handleSave}
              disabled={isLoading}
            >
              Save
            </button>
          </div>
          {errors.length > 0 && (
            <ErrorAlert errors={errors} onClose={handleErrorClose} />
          )}
        </form>
      </div>
    </div>
  );
};
