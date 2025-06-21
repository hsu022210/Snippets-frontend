import { useState, ChangeEvent, FormEvent } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import PasswordInput from '../components/auth/PasswordInput'
import AuthForm from '../components/auth/AuthForm'
import FormField from '../components/auth/FormField'
import SubmitButton from '../components/auth/SubmitButton'
import PasswordRules from '../components/auth/PasswordRules'
import { RegisterFormData, ApiRegisterErrorResponse } from '../types'
import { ApiError } from '../services'

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getErrorMessage = (error: ApiError): string => {
    // Handle validation errors from the API
    if (error.data && typeof error.data === 'object' && 'detail' in error.data) {
      const data = error.data.detail as ApiRegisterErrorResponse['detail'];
      
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
    if (error.isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    // Use the error message from ApiError
    return error.message || 'An unexpected error occurred. Please try again later.';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'danger');
      return;
    }

    try {
      setLoading(true);
      
      const token = await register(formData.username, formData.password, formData.confirmPassword, formData.email);
      
      // Ensure we have a valid token before navigating
      if (token) {
        navigate('/snippets');
      } else {
        setError('Registration successful but authentication failed. Please try logging in.');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error as ApiError);
      showToast(errorMessage, 'danger');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Register">
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