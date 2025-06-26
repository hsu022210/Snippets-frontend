import { useState, ChangeEvent, FormEvent } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import PasswordInput from '../components/auth/PasswordInput'
import AuthForm from '../components/auth/AuthForm'
import FormField from '../components/auth/FormField'
import SubmitButton from '../components/auth/SubmitButton'
import { loginSchema, validateFormData, LoginFormData } from '../utils/validationSchemas'

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data using Zod
    const validation = validateFormData(loginSchema, formData);
    
    if (!validation.success) {
      // Convert Zod errors to field-specific errors
      const errors: Record<string, string> = {};
      validation.errors.forEach(error => {
        // Extract field name from error path
        const fieldMatch = error.match(/^(.+?):/);
        if (fieldMatch) {
          const field = fieldMatch[1];
          errors[field] = error.replace(/^.+?: /, '');
        } else {
          // For general errors, show in toast
          showToast(error, 'danger');
        }
      });
      
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      const success = await login(formData.email, formData.password);
      if (success) {
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/snippets');
      } else {
        showToast('Failed to login. Please check your credentials.', 'danger');
      }
    } catch (error) {
      showToast('Failed to login. Please try again.', 'danger');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Login" className='my-5'>
      <Form onSubmit={handleSubmit} autoComplete="on">
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
          error={formErrors.email}
          isInvalid={!!formErrors.email}
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
          error={formErrors.password}
          isInvalid={!!formErrors.password}
        />
        <SubmitButton loading={loading} loadingText="Logging in...">
          Login
        </SubmitButton>
        <div className="text-center mt-3">
          <Link className="text-decoration-none" to="/forgot-password">Forgot Password?</Link>
        </div>
      </Form>
    </AuthForm>
  );
};

export default Login; 