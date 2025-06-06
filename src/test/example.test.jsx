import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { server } from './setup.tsx'
import { http, HttpResponse } from 'msw'
import { useState } from 'react'

// Example component to test
const SnippetForm = () => {
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    try {
      const response = await fetch('/api/snippets', {
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
    } catch (error) {
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

describe('SnippetForm', () => {
  it('submits form data and creates a new snippet', async () => {
    // Setup user event
    const user = userEvent.setup()

    // Render the component
    render(<SnippetForm />)

    // Fill in the form
    await user.type(screen.getByPlaceholderText('Snippet title'), 'Test Snippet')
    await user.type(screen.getByPlaceholderText('Snippet content'), 'console.log("Hello")')
    await user.selectOptions(screen.getByRole('combobox'), 'javascript')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /create snippet/i }))

    // Verify the success message
    expect(await screen.findByText(/Created snippet: Test Snippet/)).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    // Override the default handler for this test
    server.use(
      http.post('/api/snippets', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const user = userEvent.setup()
    render(<SnippetForm />)

    // Fill in the form
    await user.type(screen.getByPlaceholderText('Snippet title'), 'Test Snippet')
    await user.type(screen.getByPlaceholderText('Snippet content'), 'console.log("Hello")')
    await user.selectOptions(screen.getByRole('combobox'), 'javascript')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /create snippet/i }))

    // Verify error message
    expect(await screen.findByText('Error creating snippet')).toBeInTheDocument()
  })
}) 