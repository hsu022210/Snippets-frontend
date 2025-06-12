import { Spinner } from 'react-bootstrap';

interface InlineLoadingSpinnerProps {
  message?: string;
  variant?: string;
}

const InlineLoadingSpinner: React.FC<InlineLoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  variant = 'primary' 
}) => {
  return (
    <div className="d-flex align-items-center gap-2">
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