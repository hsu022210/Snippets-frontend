import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestProviders } from '../../test/setup';
import Contact from '../Contact';
import { contactService } from '../../services';

vi.mock('../../services', async (importOriginal: () => Promise<unknown>) => {
  const actual = await importOriginal();
  const actualObj = actual as Record<string, unknown>;
  return {
    ...(actual as object),
    contactService: {
      ...(actualObj.contactService as object),
      sendContactMessage: vi.fn(),
    },
  };
});

const mockedSendContactMessage = contactService.sendContactMessage as unknown as ReturnType<typeof vi.fn>;

describe('Contact Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderContact = () =>
    render(
      <TestProviders>
        <Contact />
      </TestProviders>
    );

  it('renders the contact form', () => {
    renderContact();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows error if required fields are empty', () => {
    renderContact();
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });

  it('shows error for invalid email', () => {
    renderContact();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('shows success message on successful submit', async () => {
    mockedSendContactMessage.mockResolvedValueOnce({});
    renderContact();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/your message has been sent/i, { exact: false })).toBeInTheDocument();
  });

  it('shows error message on failed submit', async () => {
    mockedSendContactMessage.mockRejectedValueOnce(new Error('Failed to send message.'));
    renderContact();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/failed to send message/i, { exact: false })).toBeInTheDocument();
  });
}); 