// External Stylesheets
import "src/assets/css/Modal.css";

// Local Components
import Loading from "src/components/Loading";
import ErrorAlert from "src/components/ErrorAlert";

import useEmail from "src/pages/admin/emailTemplate/hooks/useEmail.jsx";
// State Management
export const EmailTemplate = () => {
  const {
    subject,
    templateId,
    errors,
    isLoading,
    modalRef,
    handleClose,
    handleSave,
    handleSubjectChange,
    handleTemplateIdChange,
    handleErrorClose,
  } = useEmail();
  return (
    <div ref={modalRef} className="modal-wrapper">
      <div className="email-template-modal rounded-lg">
        <form className="max-w-xl mx-auto p-5">
          {isLoading && <Loading />}
          <div className="p-2">
            <label className="block mb-2 text-xl text-slate-600">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="Email subject..."
              value={subject}
              onChange={handleSubjectChange}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
              required
            />
          </div>
          <div className="p-2">
            <label className="block mb-2 text-xl text-slate-600">
              Template ID
            </label>
            <input
              type="text"
              id="templateId"
              placeholder="Mailjet template ID..."
              value={templateId}
              onChange={handleTemplateIdChange}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
              required
            />
          </div>
          <div className="flex items-center mt-8 justify-between">
            <div></div>
            <div>
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
                className="
                text-white bg-[#0fa347]  focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-[#2bbd62] 
                "
                onClick={handleSave}
                disabled={isLoading}
              >
                Save
              </button>
            </div>
          </div>
          {errors.length > 0 && (
            <ErrorAlert errors={errors} onClose={handleErrorClose} />
          )}
        </form>
      </div>
    </div>
  );
};
