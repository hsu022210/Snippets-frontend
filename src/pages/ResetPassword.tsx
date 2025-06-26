import { useState, FormEvent, ChangeEvent } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import PasswordInput from '../components/auth/PasswordInput'
import SubmitButton from '../components/auth/SubmitButton'
import PasswordRules from '../components/auth/PasswordRules'
import { useApiRequest } from '../hooks/useApiRequest'
import { useToast } from '../contexts/ToastContext'
import { PasswordFormData, ApiPasswordResetErrorResponse } from '../types'
import { authService, ApiError } from '../services'
import { passwordResetConfirmSchema, validateFormData } from '../utils/validationSchemas'

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { makeRequest } = useApiRequest();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<PasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

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

  const getErrorMessage = (error: ApiError): string => {
    // Handle validation errors from the API
    if (error.data && typeof error.data === 'object') {
      const data = error.data as ApiPasswordResetErrorResponse;
      
      // Handle field-specific errors
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

    if (!token) {
      showToast('Invalid reset token. Please request a new password reset.', 'danger');
      return;
    }

    // Validate form data using Zod
    const validation = validateFormData(passwordResetConfirmSchema, {
      token,
      password: formData.password
    });
    
    if (!validation.success) {
      // Convert Zod errors to field-specific errors
      const errors: Record<string, string> = {};
      validation.errors.forEach(error => {
        // Extract field name from error path - format is "field: message"
        const fieldMatch = error.match(/^([^:]+):\s*(.+)$/);
        if (fieldMatch) {
          const field = fieldMatch[1];
          const message = fieldMatch[2];
          errors[field] = message;
        } else {
          // For general errors, show in toast
          showToast(error, 'danger');
        }
      });
      
      setFormErrors(errors);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      
      await makeRequest(
        () => authService.confirmPasswordReset(token, formData.password),
        'Resetting your password...'
      );

      showToast('Password has been reset successfully. Please login with your new password.', 'primary', 3);
      navigate('/login');
    } catch (error) {
      console.log(error);
      const errorMessage = getErrorMessage(error as ApiError);
      showToast(errorMessage, 'danger');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Reset Password">
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
          error={formErrors.password}
          isInvalid={!!formErrors.password}
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
          error={formErrors.confirmPassword}
          isInvalid={!!formErrors.confirmPassword}
        />
        <SubmitButton loading={loading} loadingText="Resetting...">
          Reset Password
        </SubmitButton>
      </Form>
    </AuthForm>
  );
};

export default ResetPassword; 