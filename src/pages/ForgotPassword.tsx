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
import { emailSchema, validateFormDataWithFieldErrors } from '../utils/validationSchemas'

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validation = validateFormDataWithFieldErrors(emailSchema, email);
    
    if (!validation.success) {
      setEmailError(validation.fieldErrors.email || validation.generalErrors[0] || 'Invalid email');
      return;
    }
    
    try {
      setLoading(true);
      
      await makeRequest(
        () => authService.requestPasswordReset(email),
        'Sending password reset instructions...'
      );

      showToast('Password reset instructions have been sent to your email.', 'primary', 3);
      setEmail('');
      setEmailError('');
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
    if (emailError) {
      setEmailError('');
    }
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
          error={emailError}
          isInvalid={!!emailError}
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