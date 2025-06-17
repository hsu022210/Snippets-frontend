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
        expect(screen.getByText(/©/i)).toBeInTheDocument();
        expect(screen.getByText(/Alec Hsu. All rights reserved./i)).toBeInTheDocument();
      });

      it('displays app name with logo', () => {
        renderFooter();
        const appLink = screen.getByText('Code Snippets');
        expect(appLink).toBeInTheDocument();
        expect(appLink.closest('a')).toHaveAttribute('href', '/');
      });

      it('displays frontend GitHub link with correct icon', () => {
        renderFooter();
        const frontendLink = screen.getByText('Frontend');
        expect(frontendLink).toBeInTheDocument();
        expect(frontendLink.closest('a')).toHaveAttribute('href', 'https://github.com/hsu022210/Snippets-frontend');
        expect(frontendLink.closest('a')).toHaveAttribute('target', '_blank');
        expect(frontendLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
        expect(frontendLink.closest('a')).toHaveAttribute('aria-label', 'Frontend GitHub Repository');
      });

      it('displays backend API link with correct icon', () => {
        renderFooter();
        const backendLink = screen.getByText('Backend');
        expect(backendLink).toBeInTheDocument();
        expect(backendLink.closest('a')).toHaveAttribute('href', 'https://snippets-backend-69z8.onrender.com/swagger/');
        expect(backendLink.closest('a')).toHaveAttribute('target', '_blank');
        expect(backendLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
        expect(backendLink.closest('a')).toHaveAttribute('aria-label', 'Backend GitHub Repository');
      });

      it('displays disclaimer link with correct icon', () => {
        renderFooter();
        const disclaimerLink = screen.getByText('Disclaimer');
        expect(disclaimerLink).toBeInTheDocument();
        expect(disclaimerLink.closest('a')).toHaveAttribute('href', '/disclaimer');
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
      it('has correct classes and structure', () => {
        renderFooter();
        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveClass('footer', 'py-3', 'py-md-4', 'mt-auto');
        
        // Check container structure
        const container = footer.querySelector('.container');
        expect(container).toBeInTheDocument();
        
        // Check row structure
        const row = container?.querySelector('.row');
        expect(row).toHaveClass('align-items-center', 'g-3');
        
        // Check columns
        const cols = row?.querySelectorAll('[class*="col-"]');
        expect(cols).toHaveLength(3);
        
        // Check responsive classes
        cols?.forEach(col => {
          expect(col).toHaveClass('text-center');
          if (col.classList.contains('col-md-4')) {
            if (col.classList.contains('text-md-start')) {
              expect(col).toHaveClass('text-md-start');
            } else if (col.classList.contains('text-md-end')) {
              expect(col).toHaveClass('text-md-end');
            }
          }
        });
      });

      it('maintains proper spacing between elements', () => {
        renderFooter();
        const linksContainer = screen.getByText('Frontend').closest('.d-flex');
        expect(linksContainer).toHaveClass('gap-2');
        
        const mainContainer = screen.getByText('Disclaimer').closest('.d-flex');
        expect(mainContainer).toHaveClass('gap-2', 'gap-md-3');
      });
    });
  })
})