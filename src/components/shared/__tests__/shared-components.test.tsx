import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../Card'
import Container from '../Container'
import Button from '../Button'

describe('Shared Components', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      render(
        <Card className="test-card" hover={false}>
          <div>Test Content</div>
        </Card>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <Card className="custom-class" hover={false}>
          <div>Content</div>
        </Card>
      )
      expect(screen.getByText('Content').parentElement).toHaveClass('custom-class')
    })
  })

  describe('Container', () => {
    it('renders children correctly', () => {
      render(
        <Container className="test-container" fluid={false} pageContainer={false}>
          <div>Container Content</div>
        </Container>
      )
      expect(screen.getByText('Container Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <Container className="custom-container" fluid={false} pageContainer={false}>
          <div>Content</div>
        </Container>
      )
      expect(screen.getByText('Content').parentElement).toHaveClass('custom-container')
    })
  })

  describe('Button', () => {
    it('renders with correct text', () => {
      render(<Button size="md" className="test-btn">Click Me</Button>)
      expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} size="md" className="test-btn">Click Me</Button>)
      
      fireEvent.click(screen.getByText('Click Me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies variant classes correctly', () => {
      render(<Button variant="primary" size="md" className="test-btn">Primary Button</Button>)
      expect(screen.getByText('Primary Button')).toHaveClass('btn-primary')
    })

    it('can be disabled', () => {
      render(<Button disabled size="md" className="test-btn">Disabled Button</Button>)
      expect(screen.getByText('Disabled Button')).toBeDisabled()
    })
  })
}) 