import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider, useTheme } from '../ThemeContext'
import { localStorageMock } from '../../test/setup'

// Mock document.documentElement with working setAttribute/getAttribute
const attributeStore: Record<string, string> = {};
Object.defineProperty(document, 'documentElement', {
  value: {
    setAttribute: (key: string, value: string) => {
      attributeStore[key] = value;
    },
    getAttribute: (key: string) => attributeStore[key],
    removeAttribute: (key: string) => {
      delete attributeStore[key];
    },
    style: {
      setProperty: vi.fn(),
    },
  },
  writable: true,
});

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { isDark, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  return (
    <div>
      <div data-testid="is-dark">{isDark.toString()}</div>
      <div data-testid="primary-color">{primaryColor}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">Toggle Theme</button>
      <button onClick={() => setPrimaryColor('#FF6B6B')} data-testid="set-color">Set Color</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.removeAttribute('data-bs-theme');
  });

  it('provides theme context with default values', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#0d6efd');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
  });

  it('initializes with dark theme when saved in localStorage', () => {
    localStorageMock.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#0d6efd');
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
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#0d6efd');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');

    // Toggle to dark
    await user.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#0d6efd');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Toggle back to light
    await user.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#0d6efd');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('sets primary color when setPrimaryColor is called', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setColorButton = screen.getByTestId('set-color');
    await user.click(setColorButton);

    expect(screen.getByTestId('primary-color')).toHaveTextContent('#FF6B6B');
  });

  it('loads primary color from localStorage', () => {
    localStorageMock.setItem('snippets-primary-color', '#345995');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('primary-color')).toHaveTextContent('#345995');
  });

  it('initializes with dark theme when system prefers dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#0d6efd');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });
}); 