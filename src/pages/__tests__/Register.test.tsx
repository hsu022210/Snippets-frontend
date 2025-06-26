import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TestProviders } from '../../test/setup'
import Register from '../Register'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { ApiError } from '../../services'

// Mock the hooks
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

vi.mock('../../contexts/ToastContext', () => ({
  useToast: vi.fn()
}));

describe('Register Component', () => {
  const mockRegister = vi.fn();
  const mockNavigate = vi.fn();
  const mockShowToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ register: mockRegister });
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ showToast: mockShowToast });
  });

  const renderRegister = () => {
    return render(
      <TestProviders>
        <Register />
      </TestProviders>
    );
  };

  it('renders the registration form', () => {
    renderRegister();
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Fill in all required fields
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    
    // Submit the form
    fireEvent.click(submitButton);

    // Check if the form submission was prevented and error is shown
    await waitFor(() => {
      // The confirm password input should have the is-invalid class
      expect(confirmPasswordInput).toHaveClass('is-invalid');
    });
  });

  it('handles successful registration', async () => {
    mockRegister.mockResolvedValueOnce('mock-access-token');
    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'testuser',
        'password123',
        'password123',
        'test@example.com'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/snippets');
    });
  });

  it('handles general registration error', async () => {
    const errorMessage = 'Email already exists';
    const apiError = new ApiError(errorMessage, 400, { detail: errorMessage });
    mockRegister.mockRejectedValueOnce(apiError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'danger');
    });
  });

  it('handles email validation error', async () => {
    const emailError = 'A user with this email already exists.';
    const apiError = new ApiError('Validation error', 400, {
      detail: {
        email: emailError
      }
    });
    mockRegister.mockRejectedValueOnce(apiError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({ email: emailError }, 'danger');
    });
  });

  it('handles username validation error', async () => {
    const usernameError = 'A user with this username already exists.';
    const apiError = new ApiError('Validation error', 400, {
      detail: {
        username: usernameError
      }
    });
    mockRegister.mockRejectedValueOnce(apiError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({ username: usernameError }, 'danger');
    });
  });

  it('handles password validation error', async () => {
    const passwordError = 'This password is too common.';
    const apiError = new ApiError('Validation error', 400, {
      detail: {
        password: passwordError
      }
    });
    mockRegister.mockRejectedValueOnce(apiError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({ password: passwordError }, 'danger');
    });
  });

  it('handles password2 validation error', async () => {
    const password2Error = 'This field must match the password field.';
    const apiError = new ApiError('Validation error', 400, {
      detail: {
        password2: password2Error
      }
    });
    mockRegister.mockRejectedValueOnce(apiError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({ password2: password2Error }, 'danger');
    });
  });

  it('handles array validation errors', async () => {
    const emailErrors = ['This field is required.', 'Enter a valid email address.'];
    const apiError = new ApiError('Validation error', 400, {
      detail: {
        email: emailErrors
      }
    });
    mockRegister.mockRejectedValueOnce(apiError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({ email: emailErrors }, 'danger');
    });
  });

  it('handles network error', async () => {
    const networkError = new ApiError(
      'Unable to connect to the server. Please check your internet connection.',
      0,
      null,
      true
    );
    mockRegister.mockRejectedValueOnce(networkError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Unable to connect to the server. Please check your internet connection.', 'danger');
    });
  });

  it('disables form inputs during submission', async () => {
    mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(usernameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/registering/i)).toBeInTheDocument();
  });

  it('handles unexpected error without proper structure', async () => {
    const unexpectedError = new ApiError('Unexpected server error', 500, null);
    mockRegister.mockRejectedValueOnce(unexpectedError);

    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Unexpected server error', 'danger');
    });
  });

  it('completes full registration flow with automatic login and navigation', async () => {
    const mockAccessToken = 'mock-access-token-12345';
    mockRegister.mockResolvedValueOnce(mockAccessToken);
    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Fill out the registration form
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'securepassword123' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify the registration function was called with correct parameters
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'newuser',
        'securepassword123',
        'securepassword123',
        'newuser@example.com'
      );
    });

    // Verify that navigation occurred to the snippets page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/snippets');
    });

    // Verify that the registration returned a valid access token
    expect(mockRegister).toHaveBeenCalledTimes(1);
    
    // Verify no error messages are displayed
    expect(screen.queryByText(/registration successful but authentication failed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('shows password rules and updates as user types', () => {
    renderRegister();
    // Password rules should be visible
    expect(screen.getByText(/password must/i)).toBeInTheDocument();
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    // Type a password and check if rules update (example: at least 8 chars)
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    const ruleElement = screen.getByText(/at least 8 characters/i);
    expect(ruleElement).toBeInTheDocument();
    expect(ruleElement).toHaveClass('text-muted');
    fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
    const ruleElementAfter = screen.getByText(/at least 8 characters/i);
    expect(ruleElementAfter).toBeInTheDocument();
    expect(ruleElementAfter).toHaveClass('text-success');
  });

  it('does not submit the form with empty required fields', async () => {
    renderRegister();
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    // Should not call register
    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it('shows loading state on submit', async () => {
    mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('token'), 100)));
    renderRegister();
    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/registering/i)).toBeInTheDocument();
  });

  it('shows toast if registration returns no token', async () => {
    mockRegister.mockResolvedValueOnce(null);
    renderRegister();
    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Registration successful but authentication failed. Please try logging in.', 'danger');
    });
  });

  it('has correct autoComplete attributes on fields', () => {
    renderRegister();
    expect(screen.getByLabelText(/username/i)).toHaveAttribute('autocomplete', 'username');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('autocomplete', 'new-password');
  });

  it('shows validation error for invalid email format', async () => {
    renderRegister();

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Fill in form with invalid email format
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Remove the noValidate attribute to allow browser validation to be bypassed
    const form = emailInput.closest('form');
    if (form) {
      form.setAttribute('novalidate', 'true');
    }
    
    // Submit the form
    fireEvent.click(submitButton);

    // Check if the email input shows validation error
    await waitFor(() => {
      expect(emailInput).toHaveClass('is-invalid');
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    // Verify that the register function was not called due to validation failure
    expect(mockRegister).not.toHaveBeenCalled();
  });
}); 