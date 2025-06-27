import { Spinner } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { LogoutLoadingSpinnerProps } from '../types'

const LogoutLoadingSpinner: React.FC<LogoutLoadingSpinnerProps> = ({ 
  show, 
  message = 'Logging out...' 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className={`loading-overlay d-flex align-items-center justify-content-center ${isVisible ? 'show' : ''}`}>
      <div className="spinner-container d-flex flex-column align-items-center justify-content-center">
        <Spinner 
          animation="border" 
          role="status" 
          variant="light"
        >
          <span className="visually-hidden">{message}</span>
        </Spinner>
        <div className="loading-text">
          {message}
        </div>
      </div>
    </div>
  );
};

export default LogoutLoadingSpinner; 