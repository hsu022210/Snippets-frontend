import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '../../../test/setup.tsx'
import AuthForm from '../AuthForm'
import FormField from '../FormField'
import SubmitButton from '../SubmitButton'
import PasswordInput from '../PasswordInput'

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

  describe('PasswordInput', () => {
    const defaultProps = {
      value: '',
      onChange: vi.fn(),
      label: 'Password',
      name: 'password',
      id: 'password',
      required: true,
      autoComplete: 'current-password'
    }

    it('renders with label and required attributes', () => {
      render(<PasswordInput {...defaultProps} />)
      
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeRequired()
    })

    it('toggles password visibility when button is clicked', async () => {
      render(<PasswordInput {...defaultProps} />)
      
      const input = screen.getByLabelText('Password')
      const toggleButton = screen.getByRole('button', { name: /show password/i })
      
      // Initially password should be hidden
      expect(input).toHaveAttribute('type', 'password')
      
      // Click to show password
      await user.click(toggleButton)
      expect(input).toHaveAttribute('type', 'text')
      expect(toggleButton).toHaveAttribute('aria-label', 'Hide password')
      
      // Click to hide password again
      await user.click(toggleButton)
      expect(input).toHaveAttribute('type', 'password')
      expect(toggleButton).toHaveAttribute('aria-label', 'Show password')
    })

    it('handles input changes', async () => {
      render(<PasswordInput {...defaultProps} />)
      
      const input = screen.getByLabelText('Password')
      await user.type(input, 'test123')
      
      expect(defaultProps.onChange).toHaveBeenCalled()
    })

    it('displays error message when invalid', () => {
      const errorMessage = 'Password is required'
      render(
        <PasswordInput
          {...defaultProps}
          isInvalid={true}
          error={errorMessage}
        />
      )
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('is disabled when disabled prop is true', () => {
      render(<PasswordInput {...defaultProps} disabled={true} />)
      
      const input = screen.getByLabelText('Password')
      const toggleButton = screen.getByRole('button')
      
      expect(input).toBeDisabled()
      expect(toggleButton).toBeDisabled()
    })

    it('renders with custom size', () => {
      render(<PasswordInput {...defaultProps} size="lg" />)
      
      const inputGroup = screen.getByLabelText('Password').closest('.input-group')
      expect(inputGroup).toHaveClass('input-group-lg')
    })

    it('renders with custom placeholder', () => {
      const placeholder = 'Enter your password'
      render(<PasswordInput {...defaultProps} placeholder={placeholder} />)
      
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })

    it('renders without label when label prop is not provided', () => {
      const { label, ...propsWithoutLabel } = defaultProps
      render(<PasswordInput {...propsWithoutLabel} label={undefined} />)
      
      expect(screen.queryByText('Password')).not.toBeInTheDocument()
    })
  })
}) 