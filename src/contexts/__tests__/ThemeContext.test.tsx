import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext';

interface LocalStorageMock {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

// Mock localStorage
const localStorageMock = ((): LocalStorageMock => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{isDark ? 'dark' : 'light'}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-bs-theme');
  });

  it('initializes with light theme when no saved preference', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
  });

  it('initializes with dark theme when saved in localStorage', () => {
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('toggles theme when toggleTheme is called', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initial state
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');

    // Toggle to dark
    await user.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Toggle back to light
    await user.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('initializes with system preference when no saved theme', () => {
    // Mock system preference to dark
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });
}); 