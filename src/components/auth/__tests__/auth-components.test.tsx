import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '../../../test/setup.tsx'
import AuthForm from '../AuthForm'
import FormField from '../FormField'
import SubmitButton from '../SubmitButton'

describe('Auth Components', () => {
  // Setup user event
  const user = userEvent.setup()

  describe('AuthForm', () => {
    it('renders children and handles submit', () => {
      const handleSubmit = vi.fn()
      render(
        <AuthForm title="Login">
          <form onSubmit={handleSubmit} aria-label="form">
            <div>Form Content</div>
          </form>
        </AuthForm>
      )
      
      expect(screen.getByText('Form Content')).toBeInTheDocument()
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('FormField', () => {
    it('renders label and input', () => {
      render(
        <FormField
          label="Username"
          name="username"
          id="username"
          type="text"
          value=""
          onChange={() => {}}
          error=""
          isInvalid={false}
          autoComplete="username"
        />
      )
      
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    it('displays error message', () => {
      const errorMessage = 'Username is required'
      render(
        <FormField
          label="Username"
          name="username"
          id="username"
          type="text"
          value=""
          onChange={() => {}}
          error={errorMessage}
          isInvalid={true}
          autoComplete="username"
        />
      )
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  describe('SubmitButton', () => {
    it('renders with correct text', () => {
      render(<SubmitButton loading={false} loadingText="Submitting">Submit</SubmitButton>)
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    it('is disabled when loading', () => {
      render(<SubmitButton loading={true} loadingText="Submitting">Submit</SubmitButton>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('shows loading state', () => {
      render(<SubmitButton loading={true} loadingText="Submitting">Submit</SubmitButton>)
      expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })
  })
}) 