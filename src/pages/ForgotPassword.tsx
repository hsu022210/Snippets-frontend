import { useState, FormEvent, ChangeEvent } from 'react'
import { Form, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import FormField from '../components/auth/FormField'
import SubmitButton from '../components/auth/SubmitButton'
import { useApiRequest } from '../hooks/useApiRequest'
import { ApiError } from '../services'
import { authService } from '../services'

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { makeRequest } = useApiRequest();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await makeRequest(
        () => authService.requestPasswordReset(email),
        'Sending password reset instructions...'
      );

      setSuccess('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'An error occurred. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
          onChange={handleEmailChange}
          disabled={loading}
          required
          autoComplete="email"
        />
        <SubmitButton loading={loading} loadingText="Sending...">
          Send Reset Instructions
        </SubmitButton>
        <div className="text-center mt-3">
          <Link className="text-decoration-none" to="/login">Back to Login</Link>
        </div>
      </Form>
    </AuthForm>
  );
};

export default ForgotPassword; 