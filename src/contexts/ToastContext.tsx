import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { ToastType, ToastContextType, ToastProviderProps } from '../types/interfaces'

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('primary');

  const showToast = useCallback((message: string = 'Please try to reload in a few seconds if still loading.', toastType: ToastType = 'primary') => {
    setMessage(message || '');
    setType(toastType);
    setShow(true);
  }, []);

  const hideToast = useCallback(() => {
    setShow(false);
  }, []);

  const contextValue = useMemo(() => ({
    showToast,
    hideToast
  }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position="top-end" className="position-fixed m-3">
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