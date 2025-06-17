import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { server } from '../../test/setup.tsx'
import { http, HttpResponse } from 'msw'

// Example form component for testing patterns
const SnippetForm = () => {
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      const response = await fetch('/snippets', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.get('title'),
          content: formData.get('content'),
          language: formData.get('language')
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create snippet')
      }
      
      const data = await response.json()
      setStatus({ type: 'success', message: `Created snippet: ${data.title}` })
    } catch {
      setStatus({ type: 'error', message: 'Error creating snippet' })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Snippet title" />
        <textarea name="content" placeholder="Snippet content" />
        <select name="language">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <button type="submit">Create Snippet</button>
      </form>
      {status.message && (
        <div role="alert" className={status.type}>
          {status.message}
        </div>
      )}
    </div>
  )
}

describe('Form Testing Patterns', () => {
  describe('Form Submission', () => {
    it('successfully submits form data and creates a new snippet', async () => {
      const user = userEvent.setup()
      render(<SnippetForm />)

      // Fill in form fields
      await user.type(screen.getByPlaceholderText('Snippet title'), 'Test Snippet')
      await user.type(screen.getByPlaceholderText('Snippet content'), 'console.log("Hello")')
      await user.selectOptions(screen.getByRole('combobox'), 'javascript')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create snippet/i }))

      expect(await screen.findByText(/Created snippet/)).toBeInTheDocument()
    })

    it('handles API errors gracefully', async () => {
      // Mock API error response
      server.use(
        http.post('/snippets', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const user = userEvent.setup()
      render(<SnippetForm />)

      // Fill in form fields
      await user.type(screen.getByPlaceholderText('Snippet title'), 'Test Snippet')
      await user.type(screen.getByPlaceholderText('Snippet content'), 'console.log("Hello")')
      await user.selectOptions(screen.getByRole('combobox'), 'javascript')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create snippet/i }))

      // Verify error message
      expect(await screen.findByText('Error creating snippet')).toBeInTheDocument()
    })
  })
}) 