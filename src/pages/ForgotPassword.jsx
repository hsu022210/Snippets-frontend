import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import FormField from '../components/auth/FormField';
import SubmitButton from '../components/auth/SubmitButton';
import { BASE_URL } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/auth/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess('Password reset instructions have been sent to your email.');
        setEmail('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send reset instructions. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Reset Password">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          autoComplete="email"
        />
        <SubmitButton loading={loading} loadingText="Sending...">
          Send Reset Instructions
        </SubmitButton>
        <div className="text-center mt-3">
          <Link to="/login">Back to Login</Link>
        </div>
      </Form>
    </AuthForm>
  );
};

export default ForgotPassword; 