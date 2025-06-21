import { useState, FormEvent, ChangeEvent } from 'react'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import FormField from '../components/auth/FormField'
import SubmitButton from '../components/auth/SubmitButton'
import { useApiRequest } from '../hooks/useApiRequest'
import { useToast } from '../contexts/ToastContext'
import { ApiError } from '../services'
import { authService } from '../services'

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      await makeRequest(
        () => authService.requestPasswordReset(email),
        'Sending password reset instructions...'
      );

      showToast('Password reset instructions have been sent to your email.', 'primary', 3);
      setEmail('');
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message || 'An error occurred. Please try again.', 'danger');
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