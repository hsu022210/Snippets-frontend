import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/auth/PasswordInput';
import AuthForm from '../components/auth/AuthForm';
import FormField from '../components/auth/FormField';
import SubmitButton from '../components/auth/SubmitButton';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const success = await login(formData.username, formData.password);
      if (success) {
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/snippets');
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } catch (error) {
      setError('Failed to login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Login">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} autoComplete="on">
        <FormField
          label="Username"
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          required
          autoComplete="username"
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
          className="mb-4"
          autoComplete="current-password"
        />
        <SubmitButton loading={loading} loadingText="Logging in...">
          Login
        </SubmitButton>
        <div className="text-center mt-3">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </Form>
    </AuthForm>
  );
};

export default Login; 