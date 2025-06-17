import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '../../test/setup'
import Settings from '../Settings'

interface CodeMirrorProps {
  value: string;
  height: string;
  editable: boolean;
}

// Mock CodeMirror component
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, height, editable }: CodeMirrorProps) => (
    <div 
      data-testid="codemirror-mock"
      data-value={value}
      data-height={height}
      data-editable={editable}
    >
      {value}
    </div>
  )
}))

describe('Settings Page', () => {
  const user = userEvent.setup()

  const renderSettings = () => {
    return render(
      <TestProviders>
        <Settings />
      </TestProviders>
    )
  }

  it('renders settings page with theme selector', () => {
    renderSettings()
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Editor Settings')).toBeInTheDocument()
    expect(screen.getByText('Code Editor Theme')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders theme preview section', () => {
    renderSettings()
    
    expect(screen.getByText('Theme Preview')).toBeInTheDocument()
    const editor = screen.getByTestId('codemirror-mock')
    expect(editor).toBeInTheDocument()
    expect(editor).toHaveAttribute('data-editable', 'false')
    expect(editor).toHaveAttribute('data-height', '75px')
  })

  it('displays sample code in preview', () => {
    renderSettings()
    
    const editor = screen.getByTestId('codemirror-mock')
    expect(editor).toHaveTextContent('// Sample code to preview the theme')
    expect(editor).toHaveTextContent('function calculateSum(numbers)')
  })

  it('allows theme selection', async () => {
    renderSettings()
    
    const themeSelect = screen.getByRole('combobox')
    await user.selectOptions(themeSelect, 'copilot')
    
    expect(themeSelect).toHaveValue('copilot')
  })

  it('shows theme selection help text', () => {
    renderSettings()
    
    expect(screen.getByText('Choose your preferred theme for the code editor')).toBeInTheDocument()
  })
}) 