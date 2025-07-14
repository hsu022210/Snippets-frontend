import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../Card'
import Container from '../Container'
import Button from '../Button'
import CodeEditor from '../CodeEditor'
import CopyButton from '../CopyButton'
import { TestProviders } from '../../../test/setup'
import PrimaryColorModal from '../../PrimaryColorModal'
import { PRIMARY_COLORS } from '../../../utils/primaryColor'

// Mock CodeMirror component
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange, height, editable }: { value: string, onChange?: (val: string) => void, height?: string, editable?: boolean }) => (
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

    it('applies border and border radius styles with Bootstrap tokens', () => {
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
        border: '1px solid var(--bs-border-color)',
        borderRadius: '4px',
        overflow: 'hidden'
      })
    })

    it('renders copy button with Bootstrap styling', () => {
      render(
        <TestProviders>
          <CodeEditor
            value="test code"
            onChange={() => {}}
            language="javascript"
          />
        </TestProviders>
      )
      const copyButton = screen.getByRole('button', { name: /copy/i })
      const header = copyButton.closest('div')
      expect(copyButton).toBeInTheDocument()
      expect(header).toHaveStyle({
        backgroundColor: 'var(--bs-tertiary-bg)',
        borderBottom: '1px solid var(--bs-border-color)'
      })
    })
  })

  describe('CopyButton', () => {
    const mockClipboard = { writeText: vi.fn() };
    Object.assign(navigator, { clipboard: mockClipboard });

    beforeEach(() => mockClipboard.writeText.mockClear());

    it('renders and handles copy functionality', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      
      render(
        <TestProviders>
          <CopyButton textToCopy="test code" />
        </TestProviders>
      );
      
      const button = screen.getByRole('button', { name: /copy/i });
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
      
      fireEvent.click(button);
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test code');
      
      // Wait for state update
      await screen.findByText('Copied!');
    });

    it('handles disabled states and errors', async () => {
      const { rerender } = render(
        <TestProviders>
          <CopyButton textToCopy="" />
        </TestProviders>
      );
      
      expect(screen.getByRole('button')).toBeDisabled();
      
      rerender(
        <TestProviders>
          <CopyButton textToCopy="test code" disabled={true} />
        </TestProviders>
      );
      
      expect(screen.getByRole('button')).toBeDisabled();
      
      rerender(
        <TestProviders>
          <CopyButton textToCopy="test code" disabled={false} />
        </TestProviders>
      );
      
      // Mock error for the next call
      mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
      fireEvent.click(screen.getByRole('button'));
      
      // Should still show Copy text after error
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
  })

  describe('PrimaryColorModal', () => {
    const onHide = vi.fn();
    const onPrimaryColorChange = vi.fn();
    const defaultProps = {
      show: true,
      onHide,
      primaryColor: PRIMARY_COLORS[0].value,
      onPrimaryColorChange,
      isDark: false,
    };

    beforeEach(() => {
      onHide.mockClear();
      onPrimaryColorChange.mockClear();
    });

    it('renders the modal and preview section', () => {
      render(<PrimaryColorModal {...defaultProps} />);
      expect(screen.getByText('Choose Primary Color')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
      expect(screen.getByText('Buttons:')).toBeInTheDocument();
      expect(screen.getByText('Pagination:')).toBeInTheDocument();
    });

    it('renders preset color options', () => {
      render(<PrimaryColorModal {...defaultProps} />);
      PRIMARY_COLORS.forEach(color => {
        expect(screen.getByLabelText(color.label)).toBeInTheDocument();
      });
    });

    it('calls onPrimaryColorChange when a preset color is clicked', () => {
      render(<PrimaryColorModal {...defaultProps} />);
      const radio = screen.getByLabelText(PRIMARY_COLORS[1].label);
      fireEvent.click(radio);
      expect(defaultProps.onPrimaryColorChange).toHaveBeenCalled();
    });

    it('calls onHide when the close button is clicked', () => {
      render(<PrimaryColorModal {...defaultProps} />);
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(defaultProps.onHide).toHaveBeenCalled();
    });

    it('renders the custom color picker', () => {
      render(<PrimaryColorModal {...defaultProps} />);
      expect(screen.getByText('Or pick a custom color:')).toBeInTheDocument();
      expect(screen.getByText(defaultProps.primaryColor)).toBeInTheDocument();
    });
  })
}) 