import { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('primary');

  const showToast = (msg = 'The site may be slow to respond after a certain time of inactivity.', toastType = 'primary') => {
    setMessage(msg);
    setType(toastType);
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={show} 
          onClose={hideToast} 
          // delay={3000} 
          // autohide
          bg={type}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
}; 