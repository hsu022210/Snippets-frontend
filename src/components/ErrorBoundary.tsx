import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Alert, Button } from 'react-bootstrap';
import Container from './shared/Container';

interface ErrorFallbackProps extends FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

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

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

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