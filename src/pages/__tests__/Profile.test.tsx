// Mocks must be at the top
vi.mock('../../services', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    updateProfile: vi.fn(),
    requestPasswordReset: vi.fn(),
  },
}));
vi.mock('../../hooks/useApiRequest');
vi.mock('../../contexts/ToastContext');

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '../Profile';
import { TestProviders } from '../../test/setup';
import { useApiRequest } from '../../hooks/useApiRequest';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services';
import { User } from '../../types';

// --- Test Data ---
const mockUser: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
};

// --- Helpers ---
const renderProfile = () =>
  render(
    <TestProviders>
      <Profile />
    </TestProviders>
  );

// --- Test Suite ---
describe('Profile Page', () => {
  const mockMakeRequest = vi.fn();
  const mockShowToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useApiRequest as ReturnType<typeof vi.fn>).mockReturnValue({
      makeRequest: mockMakeRequest,
    });
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      showToast: mockShowToast,
    });
  });

  describe('Loading State', () => {
    it('shows spinner and loading message', () => {
      mockMakeRequest.mockImplementation(() => new Promise(() => {}));
      renderProfile();
      expect(screen.getByText('Loading profile...', { selector: '.text-muted' })).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Profile Data Loading', () => {
    it('displays user profile data on success', async () => {
      mockMakeRequest.mockResolvedValue(mockUser);
      renderProfile();
      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
        expect(screen.getByDisplayValue('User')).toBeInTheDocument();
      });
    });
    it('shows error toast on failure', async () => {
      mockMakeRequest.mockRejectedValue(new Error('Failed to fetch profile'));
      renderProfile();
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Failed to fetch profile', 'danger');
      });
    });
  });

  describe('Profile Form', () => {
    beforeEach(async () => {
      mockMakeRequest.mockResolvedValue(mockUser);
      renderProfile();
      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });
    });
    it('renders all form field labels', () => {
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
    });
    it('updates form values on user input', async () => {
      const user = userEvent.setup();
      const usernameInput = screen.getByDisplayValue('testuser');
      const emailInput = screen.getByDisplayValue('test@example.com');
      await user.clear(usernameInput);
      await user.type(usernameInput, 'newusername');
      await user.clear(emailInput);
      await user.type(emailInput, 'newemail@example.com');
      expect(usernameInput).toHaveValue('newusername');
      expect(emailInput).toHaveValue('newemail@example.com');
    });
    it('submits form and calls updateProfile with updated data', async () => {
      (authService.updateProfile as vi.Mock).mockClear();
      const user = userEvent.setup();
      const updatedUser = { ...mockUser, username: 'updateduser' };
      mockMakeRequest.mockImplementation(async (fn) => await fn());
      (authService.updateProfile as vi.Mock).mockResolvedValueOnce(updatedUser);
      const usernameInput = screen.getByDisplayValue('testuser');
      await user.clear(usernameInput);
      await user.type(usernameInput, 'updateduser');
      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);
      await waitFor(() => {
        expect(authService.updateProfile).toHaveBeenCalledWith({
          id: 1,
          username: 'updateduser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        });
      });
    });
    it('shows success toast on update', async () => {
      const user = userEvent.setup();
      mockMakeRequest.mockResolvedValueOnce(mockUser);
      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Profile updated successfully!', 'primary', 3);
      });
    });
    it('shows error toast on update failure', async () => {
      const user = userEvent.setup();
      mockMakeRequest.mockRejectedValueOnce(new Error('Update failed'));
      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Update failed', 'danger');
      });
    });
    it('disables save button while saving', async () => {
      const user = userEvent.setup();
      mockMakeRequest.mockImplementation(() => new Promise(() => {}));
      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);
      expect(saveButton).toBeDisabled();
      expect(saveButton).toHaveTextContent('Saving...');
    });
  });

  describe('Password Reset', () => {
    beforeEach(async () => {
      mockMakeRequest.mockResolvedValue(mockUser);
      renderProfile();
      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });
    });
    it('renders password reset button', () => {
      const resetButton = screen.getByRole('button', { name: /reset password/i });
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveClass('btn-outline-danger');
    });
    it('handles password reset request', async () => {
      const user = userEvent.setup();
      mockMakeRequest.mockResolvedValueOnce({ message: 'Reset email sent' });
      const resetButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(resetButton);
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'Password reset instructions have been sent to your email.',
          'primary',
          3
        );
      });
    });
    it('shows error toast on reset failure', async () => {
      const user = userEvent.setup();
      mockMakeRequest.mockRejectedValueOnce(new Error('Reset failed'));
      const resetButton = screen.getByRole('button', { name: /reset password/i });
      await user.click(resetButton);
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Reset failed', 'danger');
      });
    });
  });

  describe('Layout and UI', () => {
    beforeEach(async () => {
      mockMakeRequest.mockResolvedValue(mockUser);
      renderProfile();
      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });
    });
    it('renders page title', () => {
      expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
    });
    it('renders profile information card', () => {
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
    });
    it('renders security card', () => {
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText(/manage your account security settings/i)).toBeInTheDocument();
    });
    it('renders form with proper structure', () => {
      const form = screen.getByRole('button', { name: 'Save Changes' }).closest('form');
      expect(form).toBeInTheDocument();
      const formGroups = form?.querySelectorAll('.mb-3');
      expect(formGroups?.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      mockMakeRequest.mockResolvedValue(mockUser);
      renderProfile();
      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });
    });
    it('requires username and email fields', () => {
      const usernameInput = screen.getByDisplayValue('testuser');
      const emailInput = screen.getByDisplayValue('test@example.com');
      expect(usernameInput).toBeRequired();
      expect(emailInput).toBeRequired();
    });
    it('has correct input types', () => {
      const usernameInput = screen.getByDisplayValue('testuser');
      const emailInput = screen.getByDisplayValue('test@example.com');
      const firstNameInput = screen.getByDisplayValue('Test');
      const lastNameInput = screen.getByDisplayValue('User');
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(firstNameInput).toHaveAttribute('type', 'text');
      expect(lastNameInput).toHaveAttribute('type', 'text');
    });
  });

  describe('API Integration', () => {
    it('calls getCurrentUser on mount', async () => {
      mockMakeRequest.mockResolvedValue(mockUser);
      renderProfile();
      await waitFor(() => {
        expect(mockMakeRequest).toHaveBeenCalledWith(expect.any(Function));
      });
    });
    it('shows error toast on API error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockMakeRequest.mockRejectedValue(new Error('Network error'));
      renderProfile();
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching profile:', expect.any(Error));
        expect(mockShowToast).toHaveBeenCalledWith('Network error', 'danger');
      });
      consoleSpy.mockRestore();
    });
  });
}); 