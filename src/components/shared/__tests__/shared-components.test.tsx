import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../Card'
import Container from '../Container'
import Button from '../Button'
import CodeEditor from '../CodeEditor'
import { TestProviders } from '../../../test/setup'

// Mock CodeMirror component
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange, height, editable }) => (
    <div 
      data-testid="codemirror-mock"
      data-value={value}
      data-height={height}
      data-editable={editable}
      onClick={() => onChange && onChange('new value')}
    >
      {value}
    </div>
  )
}))

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
  })

  describe('CodeEditor', () => {
    it('renders with default props', () => {
      render(
        <TestProviders>
          <CodeEditor
            value="test code"
            onChange={() => {}}
            language="javascript"
          />
        </TestProviders>
      )
      const editor = screen.getByTestId('codemirror-mock')
      expect(editor).toBeInTheDocument()
      expect(editor).toHaveAttribute('data-value', 'test code')
      expect(editor).toHaveAttribute('data-height', '330px')
      expect(editor).toHaveAttribute('data-editable', 'true')
    })

    it('renders with custom props', () => {
      render(
        <TestProviders>
          <CodeEditor
            value="custom code"
            onChange={() => {}}
            language="python"
            height="400px"
            editable={false}
            className="custom-editor"
          />
        </TestProviders>
      )
      const editor = screen.getByTestId('codemirror-mock')
      const container = editor.parentElement
      expect(editor).toHaveAttribute('data-value', 'custom code')
      expect(editor).toHaveAttribute('data-height', '400px')
      expect(editor).toHaveAttribute('data-editable', 'false')
      expect(container).toHaveClass('custom-editor')
    })

    it('handles onChange event', () => {
      const handleChange = vi.fn()
      render(
        <TestProviders>
          <CodeEditor
            value="initial code"
            onChange={handleChange}
            language="javascript"
          />
        </TestProviders>
      )
      const editor = screen.getByTestId('codemirror-mock')
      fireEvent.click(editor)
      expect(handleChange).toHaveBeenCalledWith('new value')
    })

    it('applies border and border radius styles', () => {
      render(
        <TestProviders>
          <CodeEditor
            value="test code"
            onChange={() => {}}
            language="javascript"
          />
        </TestProviders>
      )
      const editor = screen.getByTestId('codemirror-mock')
      const container = editor.parentElement
      expect(container).toHaveStyle({
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        overflow: 'hidden'
      })
    })
  })
}) 