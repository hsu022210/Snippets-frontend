import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { server } from '../../test/setup.tsx'
import { http, HttpResponse } from 'msw'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface ApiResponse {
  message: string
}

describe('Testing Patterns', () => {
  const user = userEvent.setup()

  describe('Basic Component Testing', () => {
    it('renders static content correctly', () => {
      const StaticComponent = () => <div>Hello Testing World</div>
      
      render(<StaticComponent />)
      
      expect(screen.getByText('Hello Testing World')).toBeInTheDocument()
    })

    it('handles user interactions properly', async () => {
      const InteractiveComponent = () => (
        <div>
          <h1>Interactive Component</h1>
          <button data-testid="action-button">Click me</button>
          <input placeholder="Type something" />
        </div>
      )
      
      render(<InteractiveComponent />)
      
      // Test static content
      expect(screen.getByText('Interactive Component')).toBeInTheDocument()
      
      // Test element presence using different queries
      expect(screen.getByTestId('action-button')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
      
      // Test user input
      const input = screen.getByPlaceholderText('Type something')
      expect(input).toBeInTheDocument()
      
      await user.type(input, 'Hello, World!')
      expect(input).toHaveValue('Hello, World!')
      
      // Test button click
      await user.click(screen.getByRole('button'))
    })
  })

  describe('Router Context Testing', () => {
    it('renders components within router context', () => {
      const RoutedComponent = () => (
        <div>
          <h1>Router Context Example</h1>
        </div>
      )
      
      render(
        <MemoryRouter>
          <RoutedComponent />
        </MemoryRouter>
      )
      
      expect(screen.getByText('Router Context Example')).toBeInTheDocument()
    })
  })

  describe('API Integration Testing', () => {
    it('handles API calls and displays response data', async () => {
      // Mock API response
      server.use(
        http.get('/example', () => {
          return HttpResponse.json({ message: 'Hello from API' })
        })
      )

      const ApiComponent = () => {
        const [data, setData] = useState<ApiResponse | null>(null)
        
        useEffect(() => {
          axios.get('/example')
            .then(res => setData(res.data))
        }, [])
        
        return (
          <div>
            <h1>API Integration Example</h1>
            {data && <p>{data.message}</p>}
          </div>
        )
      }
      
      render(<ApiComponent />)
      
      // Verify API response is displayed
      expect(await screen.findByText('Hello from API')).toBeInTheDocument()
    })
  })
}) 