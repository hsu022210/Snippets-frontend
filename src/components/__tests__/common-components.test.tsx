import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '../../test/setup.tsx'
import Navigation from '../Navigation'
import PrivateRoute from '../PrivateRoute'
import ErrorBoundary from '../ErrorBoundary'
import LogoutLoadingSpinner from '../LogoutLoadingSpinner'
import Footer from '../Footer'
import { useTheme } from '../../contexts/ThemeContext'

// Mock the useTheme hook
vi.mock('../../contexts/ThemeContext', () => {
  const mockToggleTheme = vi.fn()
  return {
    useTheme: vi.fn().mockReturnValue({ isDark: false, toggleTheme: mockToggleTheme })
  }
})

describe('Common Components', () => {
  // Setup user event
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Navigation', () => {
    const renderNavigation = () => {
      return render(
        <TestProviders>
          <Navigation />
        </TestProviders>
      )
    }

    it('renders navigation links', () => {
      renderNavigation()
      
      expect(screen.getByText(/Code Snippets/i)).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('shows theme toggle', async () => {
      renderNavigation()
      
      // Verify user menu is present
      const themeToggle = screen.getByLabelText('Switch to dark mode')
      expect(themeToggle).toBeInTheDocument()
    })
  })

  describe('PrivateRoute', () => {
    const renderPrivateRoute = (children: React.ReactNode) => {
      return render(
        <TestProviders>
          <PrivateRoute>
            {children}
          </PrivateRoute>
        </TestProviders>
      )
    }

    it('renders children when authenticated', () => {
      renderPrivateRoute(<div>Protected Content</div>)
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('renders complex children correctly', () => {
      renderPrivateRoute(
        <div>
          <h1>Title</h1>
          <p>Content</p>
        </div>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('ErrorBoundary', () => {
    const renderErrorBoundary = (children: React.ReactNode) => {
      return render(
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      )
    }

    it('renders children when no error', () => {
      renderErrorBoundary(<div>Normal Content</div>)
      expect(screen.getByText('Normal Content')).toBeInTheDocument()
    })

    it('renders error UI when error occurs', async () => {
      const ThrowError = () => {
        throw new Error('Test Error')
      }

      // Suppress console error during this test
      const originalError = console.error
      console.error = vi.fn()

      renderErrorBoundary(<ThrowError />)
      
      // Verify error UI
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      
      // Test reload functionality
      const reloadButton = screen.getByRole('button', { name: /reload page/i })
      expect(reloadButton).toBeInTheDocument()
      await user.click(reloadButton)
      expect(window.location.reload).toHaveBeenCalled()

      // Restore console.error
      console.error = originalError
    })
  })

  describe('LogoutLoadingSpinner', () => {
    const renderSpinner = (show: boolean) => {
      return render(<LogoutLoadingSpinner show={show} />)
    }

    it('renders loading state correctly', () => {
      renderSpinner(true)
      
      // Verify spinner
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('spinner-border')
      
      // Verify loading message
      expect(screen.getAllByText('Logging out...')[1]).toBeInTheDocument()
    })

    it('does not render when hidden', () => {
      renderSpinner(false)
      
      // Verify spinner is not present
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      
      // Verify loading message is not present
      expect(screen.queryByText('Logging out...')).not.toBeInTheDocument()
    })

    it('handles show prop changes', () => {
      const { rerender } = renderSpinner(false)
      
      // Initially hidden
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      
      // Show spinner
      rerender(<LogoutLoadingSpinner show={true} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
      
      // Hide spinner
      rerender(<LogoutLoadingSpinner show={false} />)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    const currentYear = new Date().getFullYear();
    const copyrightText = `© ${currentYear} Alec Hsu. All rights reserved.`;

    const renderFooter = (isDark = false): ReturnType<typeof render> => {
      (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({ isDark, toggleTheme: vi.fn() });
      return render(
        <TestProviders>
          <Footer />
        </TestProviders>
      );
    };

    describe('Content', () => {
      it('displays copyright text', () => {
        renderFooter();
        expect(screen.getByText(copyrightText)).toBeInTheDocument();
      });
    });

    describe('Theme', () => {
      it('applies dark theme', () => {
        renderFooter(true);
        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveClass('theme-dark');
        expect(footer).not.toHaveClass('theme-light');
      });

      it('applies light theme', () => {
        renderFooter(false);
        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveClass('theme-light');
        expect(footer).not.toHaveClass('theme-dark');
      });
    });

    describe('Layout', () => {
      it('has correct classes', () => {
        renderFooter();
        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveClass('footer', 'py-3', 'mt-auto');
        expect(screen.getByText(copyrightText).parentElement).toHaveClass('text-center');
      });
    });
  })
})