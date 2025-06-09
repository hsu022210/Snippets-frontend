import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/auth/PasswordInput';
import AuthForm from '../components/auth/AuthForm';
import FormField from '../components/auth/FormField';
import SubmitButton from '../components/auth/SubmitButton';
import PasswordRules from '../components/auth/PasswordRules';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

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
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      await register(formData.username, formData.password, formData.confirmPassword, formData.email);
      navigate('/snippets');
    } catch (error) {
      setError(
        error.response?.data?.email?.[0] ||
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
    <AuthForm title="Register">
      {error && <Alert variant="danger">{error}</Alert>}
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