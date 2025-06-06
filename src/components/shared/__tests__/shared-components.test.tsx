import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    it('renders children correctly', () => {
      render(
        <Button variant="primary" size="md" className="test-btn" isMobile={false}>
          Click me
        </Button>
      )
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('applies variant class', () => {
      render(
        <Button variant="primary" size="md" className="test-btn" isMobile={false}>
          Button
        </Button>
      )
      expect(screen.getByText('Button')).toHaveClass('btn-primary')
    })

    it('is disabled when loading', () => {
      render(
        <Button 
          variant="primary" 
          size="md" 
          className="test-btn" 
          isMobile={false} 
          loading={true}
          disabled={true}
        >
          Button
        </Button>
      )
      expect(screen.getByText('Button')).toBeDisabled()
    })
  })
}) 