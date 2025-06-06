import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders, mockUser, mockLogout } from '../../test/setup.tsx'
import Navigation from '../Navigation'
import PrivateRoute from '../PrivateRoute'
import ErrorBoundary from '../ErrorBoundary'
import LoadingSpinner from '../LoadingSpinner'
import Container from '../shared/Container'
import { Alert } from 'react-bootstrap'

describe('Common Components', () => {
  // Setup user event
  const user = userEvent.setup()

  describe('Navigation', () => {
    it('renders navigation links', () => {
      render(
        <TestProviders>
          <Navigation />
        </TestProviders>
      )
      
      expect(screen.getByText(/Code Snippets/i)).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('shows user menu and handles logout', async () => {
      render(
        <TestProviders>
          <Navigation />
        </TestProviders>
      )
      
      expect(screen.getByText(mockUser.username)).toBeInTheDocument()
      
      // Click user menu
      await user.click(screen.getByText(mockUser.username))
      
      // Click logout
      await user.click(screen.getByRole('button', { name: /logout/i }))
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  describe('PrivateRoute', () => {
    it('renders children when authenticated', () => {
      render(
        <TestProviders>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </TestProviders>
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

    it('renders error UI when error occurs', async () => {
      const ThrowError = () => {
        throw new Error('Test Error')
      }

      // Suppress console error during this test
      const originalError = console.error;
      console.error = vi.fn();

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      
      // Test reload button
      await user.click(screen.getByRole('button', { name: /reload page/i }))
      expect(window.location.reload).toHaveBeenCalled()

      // Restore console.error
      console.error = originalError;
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