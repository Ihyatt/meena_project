import "src/assets/css/Modal.css"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import useEmailStore from 'src/pages/admin/emailTemplate/store';

import Loading from "src/components/Loading";
import ErrorAlert from "src/pages/admin/components/ErrorAlert";



export const EmailTemplate = () => {
  const [subject, setSubject] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [errors, setErrors] = useState([]);

  const subjectCharactersLimit = 50;
  const templateIdCharactersLimit = 255;

  const modalRef = useRef();
  const navigate = useNavigate();
  const {
    fetchEmailTemplate,
    saveEmailTemplate,
    isLoading
  } = useEmailStore();

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

    navigate(-1)
    event.preventDefault();

  }

  const handleSave = (event) => {
    const errors = [];
    if (!subject) {
      errors.push('Subject is required.');
    }
    if (!templateId) {
      errors.push('Template ID is required.');
    }
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
    saveEmailTemplate(receivedState.emailType, subject, templateId).then((data) => {
      setSubject(data.subject);
      setTemplateId(data.templateId);
    });
    navigate(-1);
    event.preventDefault();
  }

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    if (value.length <= subjectCharactersLimit) {
      setSubject(value);
    } else {
      window.alert(`Subject cannot exceed ${subjectCharactersLimit} characters.`);
    }
  };

  const handleTemplateIdChange = (e) => {
    const value = e.target.value;
    if (value.length <= templateIdCharactersLimit) {
      setTemplateId(value);
    } else {
      window.alert(`Template ID cannot exceed ${templateIdCharactersLimit} characters.`);
    }
  };
  const handleErrorClose = () => {
    console.log('Error alert closed');
    setErrors([]);
  };


  return (
    <div ref={modalRef} className="modal-wrapper" >
      <div className="modal rounded-lg">
        <form className="max-w-xl mx-auto p-5">
          {isLoading && <Loading />}

          <div className="input-container">
            <input
              type="text"
              id="subject"
              placeholder="Subject"
              value={subject}
              onChange={handleSubjectChange}
              className="w-full border-none box-border resize-noneblock mb-1 text-2xl focus:outline-none"
              required
            />
            <input
              type="text"
              id="templateId"
              placeholder="Template ID"
              value={templateId}
              onChange={handleTemplateIdChange}
              className="w-full border-none box-border resize-noneblock mb-1 text-2xl focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center mt-8 justify-between">
            <div></div>
            <div>
              <button
                type="button"
                className="
                  h-6
                  w-[110px]
                  cursor-pointer
                  bg-[rgb(234,237,241)]
                  border-none
                  text-[rgb(100,111,124)]
                  rounded-full
                  m-1.5
                "
                onClick={handleClose}
                disabled={isLoading}
              >
                Close
              </button>
              <button
                type="button"
                className="
                  m-1.5
                  h-6
                  w-[110px]
                  bg-[#40bf51]
                  text-white
                  border-none
                  cursor-pointer
                  rounded-full
                  font-medium
                "
                onClick={handleSave}
                disabled={isLoading}
              >
                Save
              </button>
            </div>
          </div>
          {errors.length > 0 && <ErrorAlert errors={errors} onClose={handleErrorClose} />}
        </form>
      </div>
    </div>

  );
}