import { Spinner } from 'react-bootstrap'
import { InlineLoadingSpinnerProps } from '../types'

const InlineLoadingSpinner: React.FC<InlineLoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  variant = 'primary' 
}) => {
  return (
    <div className="d-flex align-items-center gap-2 animate-fade-in-up animate-pulse">
      <Spinner 
        animation="border" 
        role="status" 
        variant={variant}
        size="sm"
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message && <span className="text-muted">{message}</span>}
    </div>
  );
};

export default InlineLoadingSpinner; 