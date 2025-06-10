import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import FormField from '../components/auth/FormField';
import SubmitButton from '../components/auth/SubmitButton';
import PasswordInput from '../components/auth/PasswordInput';
import { BASE_URL } from '../contexts/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import axios from 'axios';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const { makeRequest } = useApiRequest();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        // Redirect to login page after successful password reset
        navigate('/login', { 
          state: { message: 'Password has been reset successfully. Please login with your new password.' }
        });
      } else {
        setError(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
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
          className="mb-4"
          autoComplete="new-password"
        />
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
        />
        <SubmitButton loading={loading} loadingText="Resetting...">
          Reset Password
        </SubmitButton>
      </Form>
    </AuthForm>
  );
};

export default ResetPassword; 