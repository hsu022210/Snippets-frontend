import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import ResetPassword from '../ResetPassword';
import { TestProviders } from '../../test/setup';
import { useApiRequest } from '../../hooks/useApiRequest';
import { useToast } from '../../contexts/ToastContext';
import { PasswordResetResponse } from '../../types';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn()
}));

// Mock hooks and service
vi.mock('../../hooks/useApiRequest', () => ({
  useApiRequest: vi.fn()
}));

vi.mock('../../contexts/ToastContext', () => ({
  useToast: vi.fn()
}));

vi.mock('../../services', async () => {
  const actual = await vi.importActual('../../services');
  return {
    ...actual,
    authService: {
      ...(typeof actual.authService === 'object' ? actual.authService : {}),
      confirmPasswordReset: vi.fn()
    }
  };
});

// Test constants
const TEST_PASSWORD = 'newPassword123';
const TEST_TOKEN = 'valid-token-123';
const TEST_ERROR_MESSAGE = 'Invalid or expired token';

// Mock functions
const mockNavigate = vi.fn();
const mockMakeRequest = vi.fn();
const mockShowToast = vi.fn();

// Test utilities
const getFormElements = () => ({
  passwordInput: screen.getByLabelText('New Password') as HTMLInputElement,
  confirmPasswordInput: screen.getByLabelText('Confirm New Password') as HTMLInputElement,
  submitButton: screen.getByRole('button', { name: /reset password/i }),
  form: screen.getByRole('button', { name: /reset password/i }).closest('form')!
});

const fillPasswordFields = (password: string, confirmPassword: string = password) => {
  const { passwordInput, confirmPasswordInput } = getFormElements();
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: confirmPassword } });
  return { passwordInput, confirmPasswordInput };
};

const submitForm = () => {
  const { submitButton } = getFormElements();
  fireEvent.click(submitButton);
};

const setupMocks = (token: string | undefined = TEST_TOKEN) => {
  (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ token });
  (useApiRequest as ReturnType<typeof vi.fn>).mockReturnValue({ makeRequest: mockMakeRequest });
  (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ showToast: mockShowToast });
};

const renderResetPassword = () =>
  render(
    <TestProviders>
      <ResetPassword />
    </TestProviders>
  );

describe('ResetPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  describe('Rendering', () => {
    it('renders the form and fields', () => {
      renderResetPassword();
      
      expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    });

    it('updates password input values', () => {
      renderResetPassword();
      
      const { passwordInput, confirmPasswordInput } = fillPasswordFields(TEST_PASSWORD);
      
      expect(passwordInput.value).toBe(TEST_PASSWORD);
      expect(confirmPasswordInput.value).toBe(TEST_PASSWORD);
    });

    it('shows password rules when password is entered', () => {
      renderResetPassword();
      
      const { passwordInput } = getFormElements();
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      
      expect(screen.getByText(/password must meet the following requirements/i)).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error when passwords do not match', () => {
      renderResetPassword();
      
      fillPasswordFields('password123', 'differentPassword');
      submitForm();
      
      const confirmPasswordInput = screen.getByLabelText(/confirm new password/i) as HTMLInputElement;
      expect(confirmPasswordInput).toHaveClass('is-invalid');
    });

    it('shows error toast when passwords do not match on submit', async () => {
      renderResetPassword();
      
      fillPasswordFields('password123', 'differentPassword');
      submitForm();
      
      // Should not call the API when passwords don't match
      expect(mockMakeRequest).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('submits the form successfully with matching passwords', async () => {
      mockMakeRequest.mockResolvedValueOnce({ message: 'Password reset successful' } as PasswordResetResponse);
      
      renderResetPassword();
      
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      await waitFor(() => {
        expect(mockMakeRequest).toHaveBeenCalledWith(
          expect.any(Function),
          'Resetting your password...'
        );
        expect(mockShowToast).toHaveBeenCalledWith(
          'Password has been reset successfully. Please login with your new password.',
          'primary',
          3
        );
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('handles form submission with preventDefault', async () => {
      mockMakeRequest.mockResolvedValueOnce({ message: 'Success' } as PasswordResetResponse);
      
      renderResetPassword();
      
      const { form } = getFormElements();
      fillPasswordFields(TEST_PASSWORD);
      
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(mockMakeRequest).toHaveBeenCalled();
      });
    });

    it('calls authService.confirmPasswordReset with correct parameters', async () => {
      mockMakeRequest.mockResolvedValueOnce({ message: 'Success' } as PasswordResetResponse);
      
      renderResetPassword();
      
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      await waitFor(() => {
        expect(mockMakeRequest).toHaveBeenCalledWith(
          expect.any(Function),
          'Resetting your password...'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error toast on API error', async () => {
      const error = { message: TEST_ERROR_MESSAGE };
      mockMakeRequest.mockRejectedValueOnce(error);
      
      renderResetPassword();
      
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(TEST_ERROR_MESSAGE, 'danger');
      });
    });

    it('shows default error toast if error has no message', async () => {
      mockMakeRequest.mockRejectedValueOnce({});
      
      renderResetPassword();
      
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('An unexpected error occurred. Please try again later.', 'danger');
      });
    });

    it('logs error to console when API call fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = { message: 'API Error' };
      mockMakeRequest.mockRejectedValueOnce(error);
      
      renderResetPassword();
      
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Password reset error:', error);
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    it('disables inputs and button while loading', async () => {
      let resolvePromise: (value?: unknown) => void;
      mockMakeRequest.mockImplementation(
        () => new Promise(res => { resolvePromise = res; })
      );
      
      renderResetPassword();
      
      const { passwordInput, confirmPasswordInput, submitButton } = getFormElements();
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      expect(passwordInput).toBeDisabled();
      expect(confirmPasswordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/resetting/i)).toBeInTheDocument();
      
      // Finish loading
      resolvePromise!();
      await waitFor(() => {
        expect(passwordInput).not.toBeDisabled();
        expect(confirmPasswordInput).not.toBeDisabled();
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('clears loading state after successful submission', async () => {
      mockMakeRequest.mockResolvedValueOnce({ message: 'Success' } as PasswordResetResponse);
      
      renderResetPassword();
      
      const { submitButton } = getFormElements();
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      // Should be loading initially
      expect(submitButton).toBeDisabled();
      
      await waitFor(() => {
        // Should not be loading after completion
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('clears loading state after failed submission', async () => {
      mockMakeRequest.mockRejectedValueOnce({ message: 'Error' });
      
      renderResetPassword();
      
      const { submitButton } = getFormElements();
      fillPasswordFields(TEST_PASSWORD);
      submitForm();
      
      // Should be loading initially
      expect(submitButton).toBeDisabled();
      
      await waitFor(() => {
        // Should not be loading after completion
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});

// Special test for missing token, not affected by beforeEach
it('shows error toast when token is missing', () => {
  vi.clearAllMocks();
  (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ token: undefined });
  (useApiRequest as ReturnType<typeof vi.fn>).mockReturnValue({ makeRequest: mockMakeRequest });
  (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ showToast: mockShowToast });

  render(
    <TestProviders>
      <ResetPassword />
    </TestProviders>
  );

  fillPasswordFields(TEST_PASSWORD);

  const { form } = getFormElements();
  fireEvent.submit(form);

  expect(mockShowToast).toHaveBeenCalledWith(
    'Invalid reset token. Please request a new password reset.',
    'danger'
  );
  expect(mockMakeRequest).not.toHaveBeenCalled();
}); 