import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, expect, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ToastProvider } from '../contexts/ToastContext'
import { AuthProvider } from '../contexts/AuthContext'
import { CodeMirrorThemeProvider } from '../contexts/CodeMirrorThemeContext'
import { TestProvidersProps, LocalStorageMock } from '../types'

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers)

// Setup MSW server
export const server = setupServer(...handlers)

// Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

export const localStorageMock = ((): LocalStorageMock => {
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


// Mock window.location.reload
const originalLocation = window.location
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: { ...originalLocation, reload: vi.fn() },
    writable: true
  })
})
afterAll(() => {
  Object.defineProperty(window, 'location', {
    value: originalLocation,
    writable: true
  })
})

// Mock console methods to silence logs during tests
beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});
});

// Setup and teardown
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
  vi.clearAllMocks()
})
afterAll(() => server.close())

// Common test providers

export const TestProviders: React.FC<TestProvidersProps> = ({ children }) => {
  return (
    <ToastProvider>
      <ThemeProvider>
        <CodeMirrorThemeProvider>
          <AuthProvider>
            <MemoryRouter>
              {children}
            </MemoryRouter>
          </AuthProvider>
        </CodeMirrorThemeProvider>
      </ThemeProvider>
    </ToastProvider>
  )
}
