import { Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const LoadingSpinner = ({ show }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (show) {
      setIsVisible(true);
    } else {
      // When hiding, wait for minimum duration before actually hiding
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
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
          <span className="visually-hidden">Logging out...</span>
        </Spinner>
        <div className="loading-text">
          Logging out...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 