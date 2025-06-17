import { useState, FormEvent, ChangeEvent } from 'react'
import { Form, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import FormField from '../components/auth/FormField'
import SubmitButton from '../components/auth/SubmitButton'
import { BASE_URL } from '../contexts/AuthContext'
import { useApiRequest } from '../hooks/useApiRequest'
import axios, { AxiosError } from 'axios'
import { ApiErrorResponse } from '../types'

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
      
      const response = await makeRequest(
        () => axios.post(`${BASE_URL}/auth/password-reset/`, { email }),
        'Sending password reset instructions...'
      );

      if (response.status === 200) {
        setSuccess('Password reset instructions have been sent to your email.');
        setEmail('');
      } else {
        setError(response.data.message || 'Failed to send reset instructions. Please try again.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'An error occurred. Please try again.');
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