import { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/shared/PasswordInput';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      await register(username, password, confirmPassword);
      // If we get here, registration and login were successful
      navigate('/snippets');
    } catch (error) {
      setError(
        error.response?.data?.password?.[0] || 
        error.response?.data?.username?.[0] || 
        'Failed to register. Please try again.'
      );
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  isInvalid={password !== confirmPassword && confirmPassword !== ''}
                  error={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
                />
                <Button
                  className="w-100 d-flex align-items-center justify-content-center"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 