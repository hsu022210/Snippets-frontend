import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from '../ForgotPassword';
import { TestProviders } from '../../test/setup';
import { useApiRequest } from '../../hooks/useApiRequest';
import { useToast } from '../../contexts/ToastContext';
import { PasswordResetResponse } from '../../types';

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
      requestPasswordReset: vi.fn()
    }
  };
});

const mockMakeRequest = vi.fn();
const mockShowToast = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (useApiRequest as ReturnType<typeof vi.fn>).mockReturnValue({ makeRequest: mockMakeRequest });
  (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ showToast: mockShowToast });
});

const renderForgotPassword = () =>
  render(
    <TestProviders>
      <ForgotPassword />
    </TestProviders>
  );

describe('ForgotPassword Component', () => {
  it('renders the form and fields', () => {
    renderForgotPassword();
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
  });

  it('updates email input value', () => {
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('submits the form and shows success toast', async () => {
    mockMakeRequest.mockResolvedValueOnce({ message: 'Instructions sent' } as PasswordResetResponse);
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockMakeRequest).toHaveBeenCalledWith(
        expect.any(Function),
        'Sending password reset instructions...'
      );
      expect(mockShowToast).toHaveBeenCalledWith(
        'Password reset instructions have been sent to your email.',
        'primary',
        3
      );
      expect(emailInput).toHaveValue('');
    });
  });

  it('shows error toast on API error', async () => {
    const error = { message: 'User not found' };
    mockMakeRequest.mockRejectedValueOnce(error);
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    fireEvent.change(emailInput, { target: { value: 'fail@example.com' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('User not found', 'danger');
    });
  });

  it('shows default error toast if error has no message', async () => {
    mockMakeRequest.mockRejectedValueOnce({});
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    fireEvent.change(emailInput, { target: { value: 'fail2@example.com' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('An error occurred. Please try again.', 'danger');
    });
  });

  it('disables input and button while loading', async () => {
    let resolvePromise: (value?: unknown) => void;
    mockMakeRequest.mockImplementation(
      () => new Promise(res => { resolvePromise = res; })
    );
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    fireEvent.change(emailInput, { target: { value: 'loading@example.com' } });
    fireEvent.click(submitButton);
    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/sending/i)).toBeInTheDocument();
    // Finish loading
    resolvePromise!();
    await waitFor(() => expect(emailInput).not.toBeDisabled());
  });

  it('navigates to login when clicking the link', () => {
    renderForgotPassword();
    const loginLink = screen.getByRole('link', { name: /back to login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
}); 