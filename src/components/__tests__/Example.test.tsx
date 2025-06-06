import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { server } from '../../test/setup.tsx'
import { http, HttpResponse } from 'msw'

interface ApiResponse {
  message: string
}

// Example of a simple component test
describe('Example Component Test', () => {
  // Setup user event
  const user = userEvent.setup()

  it('should render a simple component', () => {
    const ExampleComponent = () => <div>Hello Testing World</div>
    
    render(<ExampleComponent />)
    
    expect(screen.getByText('Hello Testing World')).toBeInTheDocument()
  })

  it('demonstrates different testing patterns', async () => {
    const ExampleComponent = () => (
      <div>
        <h1>Testing Examples</h1>
        <button data-testid="example-button">Click me</button>
        <input placeholder="Type something" />
      </div>
    )
    
    render(<ExampleComponent />)
    
    // Testing by text content
    expect(screen.getByText('Testing Examples')).toBeInTheDocument()
    
    // Testing by test ID
    expect(screen.getByTestId('example-button')).toBeInTheDocument()
    
    // Testing by role
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    // Testing by placeholder
    const input = screen.getByPlaceholderText('Type something')
    expect(input).toBeInTheDocument()
    
    // Test user interaction
    await user.type(input, 'Hello, World!')
    expect(input).toHaveValue('Hello, World!')
    
    await user.click(screen.getByRole('button'))
  })

  it('demonstrates testing with Router context', () => {
    const ExampleComponent = () => (
      <div>
        <h1>Router Example</h1>
      </div>
    )
    
    render(
      <MemoryRouter>
        <ExampleComponent />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Router Example')).toBeInTheDocument()
  })

  it('demonstrates testing with API calls', async () => {
    // Setup MSW handler for this test
    server.use(
      http.get('/api/example', () => {
        return HttpResponse.json({ message: 'Hello from API' })
      })
    )

    const ExampleComponent = () => {
      const [data, setData] = React.useState<ApiResponse | null>(null)
      
      React.useEffect(() => {
        fetch('/api/example')
          .then(res => res.json())
          .then(setData)
      }, [])
      
      return (
        <div>
          <h1>API Example</h1>
          {data && <p>{data.message}</p>}
        </div>
      )
    }
    
    render(<ExampleComponent />)
    
    // Wait for API response
    expect(await screen.findByText('Hello from API')).toBeInTheDocument()
  })
}) 