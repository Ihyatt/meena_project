import "src/assets/css/Modal.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import useEmailStore from "src/pages/admin/emailTemplate/store";

import Loading from "src/components/Loading";
import ErrorAlert from "src/components/ErrorAlert";

export const EmailTemplate = () => {
  const [subject, setSubject] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [errors, setErrors] = useState([]);

  const subjectCharactersLimit = 50;
  const templateIdCharactersLimit = 255;

  const modalRef = useRef();
  const navigate = useNavigate();
  const { fetchEmailTemplate, saveEmailTemplate, isLoading } = useEmailStore();

  const location = useLocation();
  const receivedState = location.state;

  useEffect(() => {
    fetchEmailTemplate(receivedState.emailType).then((data) => {
      setSubject(data.subject);
      setTemplateId(data.templateId);
    });
  }, [fetchEmailTemplate]);

  useEffect(() => {
    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  const handleClose = (event) => {
    navigate(-1);
    event.preventDefault();
  };

  const handleSave = (event) => {
    const errors = [];
    if (!subject) {
      errors.push("Subject is required.");
    }
    if (!templateId) {
      errors.push("Template ID is required.");
    }
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
    saveEmailTemplate(receivedState.emailType, subject, templateId).then(
      (data) => {
        setSubject(data.subject);
        setTemplateId(data.templateId);
      }
    );
    navigate(-1);
    event.preventDefault();
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    if (value.length <= subjectCharactersLimit) {
      setSubject(value);
    } else {
      window.alert(
        `Subject cannot exceed ${subjectCharactersLimit} characters.`
      );
    }
  };

  const handleTemplateIdChange = (e) => {
    const value = e.target.value;
    if (value.length <= templateIdCharactersLimit) {
      setTemplateId(value);
    } else {
      window.alert(
        `Template ID cannot exceed ${templateIdCharactersLimit} characters.`
      );
    }
  };
  const handleErrorClose = () => {
    setErrors([]);
  };

  return (
    <div ref={modalRef} className="modal-wrapper">
      <div className="modal rounded-lg">
        <form className="max-w-xl mx-auto p-5">
          {isLoading && <Loading />}

          <div className="p-2">
            <label class="block mb-2 text-sm text-slate-600">Subject</label>

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
            <label class="block mb-2 text-sm text-slate-600">Template ID</label>

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
                className="
                  text-white bg-[#0fa347]  focus:outline-none  focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  hover:bg-[#2bbd62] 
                "
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
