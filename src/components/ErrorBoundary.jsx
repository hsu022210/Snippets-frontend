import React, { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
import Container from './shared/Container';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container pageContainer>
          <div className="center-content">
            <Alert variant="danger">
              <Alert.Heading>Something went wrong</Alert.Heading>
              <p>
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => window.location.reload()}
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

    return this.props.children;
  }
}

export default ErrorBoundary;
