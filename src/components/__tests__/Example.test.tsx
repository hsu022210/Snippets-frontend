import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Example of a simple component test
describe('Example Component Test', () => {
  it('should render a simple component', () => {
    const ExampleComponent = () => <div>Hello Testing World</div>
    
    render(<ExampleComponent />)
    
    expect(screen.getByText('Hello Testing World')).toBeInTheDocument()
  })

  it('demonstrates different testing patterns', () => {
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
    expect(screen.getByPlaceholderText('Type something')).toBeInTheDocument()
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
}) 