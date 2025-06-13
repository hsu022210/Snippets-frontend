import { useState, FormEvent, ChangeEvent } from 'react'
import { Form, Alert } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import PasswordInput from '../components/auth/PasswordInput'
import SubmitButton from '../components/auth/SubmitButton'
import PasswordRules from '../components/auth/PasswordRules'
import { BASE_URL } from '../contexts/AuthContext'
import { useApiRequest } from '../hooks/useApiRequest'
import axios, { AxiosError } from 'axios'
import { PasswordFormData, ApiErrorResponse } from '../types/interfaces'

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { makeRequest } = useApiRequest();

  const [formData, setFormData] = useState<PasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const response = await makeRequest(
        () => axios.post(`${BASE_URL}/auth/password-reset/confirm/`, {
          token,
          password: formData.password,
        }),
        'Resetting your password...'
      );

      if (response.status === 200) {
        navigate('/login', { 
          state: { 
            message: 'Password has been reset successfully. Please login with your new password.' 
          }
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Reset Password">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <PasswordInput
          label="New Password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          size="lg"
          className="mb-2"
          autoComplete="new-password"
        />
        <PasswordRules password={formData.password} />
        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
          size="lg"
          className="mb-4"
          autoComplete="new-password"
          isInvalid={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
          error={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
        />
        <SubmitButton loading={loading} loadingText="Resetting...">
          Reset Password
        </SubmitButton>
      </Form>
    </AuthForm>
  );
};

export default ResetPassword; 