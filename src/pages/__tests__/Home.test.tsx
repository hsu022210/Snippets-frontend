import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../Home';
import { TestProviders } from '../../test/setup';
import { useAuth } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

const renderHome = () =>
  render(
    <TestProviders>
      <Home />
    </TestProviders>
  );

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading, lead, and feature cards', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });
    renderHome();
    expect(screen.getByRole('heading', { name: /simple and elegant way/i })).toBeInTheDocument();
    expect(screen.getByText(/start creating your own snippets/i)).toBeInTheDocument();
    expect(screen.getAllByText(/store/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/syntax highlighting/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/share/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/save your code snippets/i)).toBeInTheDocument();
    expect(screen.getByText(/beautiful syntax highlighting/i)).toBeInTheDocument();
    expect(screen.getByText(/share your snippets/i)).toBeInTheDocument();
  });

  it('shows Login and Register buttons when not authenticated', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });
    renderHome();
    const loginBtn = screen.getByRole('button', { name: /login/i });
    const registerBtn = screen.getByRole('button', { name: /register/i });
    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
    expect(loginBtn.closest('a')).toHaveAttribute('href', '/login');
    expect(registerBtn.closest('a')).toHaveAttribute('href', '/register');
  });

  it('shows View My Snippets and Create Snippet buttons when authenticated', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: { id: 1, username: 'test', email: 'test@example.com', first_name: '', last_name: '' } });
    renderHome();
    const viewBtn = screen.getByRole('button', { name: /view my snippets/i });
    const createBtn = screen.getByRole('button', { name: /create snippet/i });
    expect(viewBtn).toBeInTheDocument();
    expect(createBtn).toBeInTheDocument();
    expect(viewBtn.closest('a')).toHaveAttribute('href', '/snippets');
    expect(createBtn.closest('a')).toHaveAttribute('href', '/create-snippet');
  });
}); 