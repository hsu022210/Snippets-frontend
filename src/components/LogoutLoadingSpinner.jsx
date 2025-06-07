import { Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const LogoutLoadingSpinner = ({ show, message = 'Logging out...' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className={`loading-overlay ${isVisible ? 'show' : ''}`}>
      <div className="spinner-container">
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