import React from 'react'
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Navigation from '../Navigation'
import PrivateRoute from '../PrivateRoute'
import ErrorBoundary from '../ErrorBoundary'
import LoadingSpinner from '../LoadingSpinner'
import { ThemeProvider } from '../../contexts/ThemeContext'
import Container from '../shared/Container'
import { Alert } from 'react-bootstrap'

// Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const mockUser = { id: '1', username: 'testuser' }
const mockLogout = vi.fn()

// Mock AuthContext at the top level
vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({ user: mockUser, logout: mockLogout })
}))

const TestAuthProvider = ({ children }) => (
  <ThemeProvider>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </ThemeProvider>
)

describe('Common Components', () => {
  describe('Navigation', () => {
    it('renders navigation links', () => {
      render(
        <TestAuthProvider>
          <Navigation />
        </TestAuthProvider>
      )
      
      expect(screen.getByText(/Code Snippets/i)).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('shows user menu', () => {
      render(
        <TestAuthProvider>
          <Navigation />
        </TestAuthProvider>
      )
      
      expect(screen.getByText(mockUser.username)).toBeInTheDocument()
    })
  })

  describe('PrivateRoute', () => {
    it('renders children when authenticated', () => {
      render(
        <TestAuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div>Protected Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </TestAuthProvider>
      )
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  describe('ErrorBoundary', () => {
    it('renders children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Normal Content</div>
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Normal Content')).toBeInTheDocument()
    })

    it('renders error UI when error occurs', () => {
      const ThrowError = () => {
        throw new Error('Test Error')
      }

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
    })
  })

  describe('LoadingSpinner', () => {
    it('renders spinner', () => {
      render(<LoadingSpinner show={true} />)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('spinner-border')
    })

    it('is not visible when show is false', () => {
      render(<LoadingSpinner show={false} />)
      
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })
})