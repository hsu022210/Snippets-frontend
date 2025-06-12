import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestProviders } from '../../test/setup';
import Footer from '../Footer';
import { useTheme } from '../../contexts/ThemeContext';

// Mock the useTheme hook
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: vi.fn()
}));

describe('Footer', () => {
  const mockToggleTheme = vi.fn();
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} Alec Hsu. All rights reserved.`;

  const renderFooter = (isDark = false): ReturnType<typeof render> => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({ isDark, toggleTheme: mockToggleTheme });
    return render(
      <TestProviders>
        <Footer />
      </TestProviders>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
}); 