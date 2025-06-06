import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Alert, Button } from 'react-bootstrap';
import Container from './shared/Container';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Container pageContainer>
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
}

const ErrorBoundary = ({ children }) => {
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
