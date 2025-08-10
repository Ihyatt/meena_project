import "src/assets/css/Modal.css"
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import useEmailStore from 'src/stores/Email';

import Loading from "src/components/Loading";


export const EmailTemplate = () => {
  const modalRef = useRef();
  const navigate = useNavigate();
  const {
    fetchEmailTemplate,
    saveEmailTemplate,
    subject,
    setSubject,
    isLoading
  } = useEmailStore();

  const location = useLocation();
  const receivedState = location.state;

  useEffect(() => {
    fetchEmailTemplate(receivedState.emailType);

    const observerRefValue = modalRef.current;
    disableBodyScroll(observerRefValue);

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, [fetchEmailTemplate, receivedState.emailType]);

  const handleClose = (event) => {

    navigate('/admins')
    event.preventDefault();

  }

  const handleSave = (event) => {
    saveEmailTemplate(receivedState.emailType)
    event.preventDefault();
  }

  return (
    <div ref={modalRef} className="modal-wrapper" >
      <div className="modal rounded-lg">
        <form className="max-w-xl mx-auto p-5">
          {isLoading && <Loading />}

          <div className="input-container">
            <input
              type="text"
              id="title"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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
        </form>

      </div>
    </div>

  );
}