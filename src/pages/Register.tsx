import { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/auth/PasswordInput';
import AuthForm from '../components/auth/AuthForm';
import FormField from '../components/auth/FormField';
import SubmitButton from '../components/auth/SubmitButton';
import PasswordRules from '../components/auth/PasswordRules';
import { AxiosError } from 'axios';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ApiErrorResponse {
  detail: {
    email?: string | string[];
    username?: string | string[];
    password?: string | string[];
    password2?: string | string[];
    detail?: string;
  };
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
    // Handle validation errors from the API
    if (error.response?.data) {
      const data = error.response.data.detail;
      
      // Handle field-specific errors
      if (data.email) {
        return `${Array.isArray(data.email) ? data.email.join(', ') : data.email}`;
      }
      if (data.username) {
        return `${Array.isArray(data.username) ? data.username.join(', ') : data.username}`;
      }
      if (data.password) {
        return `${Array.isArray(data.password) ? data.password.join(', ') : data.password}`;
      }
      if (data.password2) {
        return `${Array.isArray(data.password2) ? data.password2.join(', ') : data.password2}`;
      }
      
      // Handle non-field errors
      if (data.detail) {
        return data.detail;
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    // Handle unexpected errors
    return 'An unexpected error occurred. Please try again later.';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      await register(formData.username, formData.password, formData.confirmPassword, formData.email);
      navigate('/snippets');
    } catch (error) {
      const errorMessage = getErrorMessage(error as AxiosError<ApiErrorResponse>);
      setError(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Register">
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormField
          label="Username"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          required
          autoComplete="username"
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          required
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          size="lg"
          className="mb-3"
          autoComplete="new-password"
        />
        <PasswordRules password={formData.password} />
        <PasswordInput
          label="Confirm Password"
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
        <SubmitButton loading={loading} loadingText="Registering...">
          Register
        </SubmitButton>
      </Form>
    </AuthForm>
  );
};

export default Register; 