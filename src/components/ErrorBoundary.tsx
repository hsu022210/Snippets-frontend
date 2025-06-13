import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Alert } from 'react-bootstrap';
import Button from './shared/Button';
import Container from './shared/Container';
import { ErrorFallbackProps, ErrorBoundaryProps } from '../types/interfaces';

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Container>
      <div className="center-content">
        <Alert variant="danger">
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p>
            {error?.message || 'An unexpected error occurred'}
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={resetErrorBoundary}
              variant="outline-danger"
            >
              Reload Page
            </Button>
          </div>
        </Alert>
      </div>
    </Container>
  );
};

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary; 