// External Stylesheets
import "src/assets/css/Modal.css";

// React Hooks and Router
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// External Libraries
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

// State Management
import useEmailStore from "src/pages/admin/emailTemplate/store";

const useEmail = () => {
  const [subject, setSubject] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [errors, setErrors] = useState([]);

  const subjectCharactersLimit = 100;
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
  }, []);

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
  return {
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
  };
};
export default useEmail;
