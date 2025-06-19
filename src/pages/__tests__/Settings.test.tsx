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

  describe('Layout', () => {
    it('renders two separate cards for navigation and content', () => {
      renderSettings()
      
      const cards = screen.getAllByRole('generic').filter(el => 
        el.className.includes('card') && !el.className.includes('card-body')
      )
      expect(cards).toHaveLength(2)
    })
  })

  describe('Navigation', () => {
    it('renders all navigation items', () => {
      renderSettings()
      
      const navLinks = screen.getAllByRole('tab')
      expect(navLinks).toHaveLength(3)
      expect(navLinks[0]).toHaveTextContent('General Settings')
      expect(navLinks[1]).toHaveTextContent('Editor Settings')
      expect(navLinks[2]).toHaveTextContent('Display Settings')
    })

    it('shows editor settings by default', () => {
      renderSettings()
      
      expect(screen.getByText('Code Editor Theme')).toBeInTheDocument()
      expect(screen.getByText('Snippet Preview Height')).toBeInTheDocument()
    })
  })

  describe('Editor Settings', () => {
    it('renders theme selector and preview', () => {
      renderSettings()
      
      expect(screen.getByText('Code Editor Theme')).toBeInTheDocument()
      expect(screen.getByTestId('theme-select')).toBeInTheDocument()
      expect(screen.getByText('Theme Preview')).toBeInTheDocument()
    })

    it('allows theme selection', async () => {
      renderSettings()
      
      const themeSelect = screen.getByTestId('theme-select')
      expect(themeSelect).toHaveValue('copilot')

      await user.selectOptions(themeSelect, 'sublime')
      expect(themeSelect).toHaveValue('sublime')
    })

    it('displays sample code in preview', () => {
      renderSettings()
      
      const editor = screen.getByTestId('codemirror-mock')
      expect(editor).toHaveTextContent('// Sample code to preview the theme')
      expect(editor).toHaveTextContent('function calculateSum(numbers)')
    })

    it('shows theme selection help text', () => {
      renderSettings()
      
      expect(screen.getByText('Choose your preferred theme for the code editor')).toBeInTheDocument()
    })
  })

  describe('Display Settings', () => {
    it('renders snippets per page selector', async () => {
      renderSettings()
      
      // Navigate to Display Settings
      const displaySettingsLink = screen.getAllByRole('tab')[1]
      await user.click(displaySettingsLink)
      
      expect(screen.getByText('Snippets Per Page')).toBeInTheDocument()
      expect(screen.getByText('Choose how many snippets to display per page in the snippet list')).toBeInTheDocument()
    })

    it('allows changing snippets per page', async () => {
      renderSettings()
      
      // Navigate to Display Settings
      const displaySettingsLink = screen.getAllByRole('tab')[1]
      await user.click(displaySettingsLink)
      
      const pageSizeLabel = screen.getByText('Snippets Per Page')
      const pageSizeSelect = pageSizeLabel.closest('div')?.querySelector('select')
      expect(pageSizeSelect).toBeInTheDocument()
      
      if (pageSizeSelect) {
        await user.selectOptions(pageSizeSelect, '12')
        expect(pageSizeSelect).toHaveValue('12')
      }
    })
  })

  describe('General Settings', () => {
    it('renders theme toggle switch', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      expect(screen.getByText('Application Theme')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('shows theme toggle help text', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      expect(screen.getByText('Switch between light and dark mode')).toBeInTheDocument()
    })

    it('shows the color select button with outline-primary variant and correct label', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      // The button should have the color label (e.g., 'Bootstrap Blue')
      const colorButton = screen.getByRole('button', { name: /blue|green|gray|purple|red|orange|yellow|mint|sage|teal|charcoal|mauve|pink|fandango|tangelo|peach|vermilion|coral|navy|ocean|sky|dark|steel/i })
      expect(colorButton).toHaveClass('btn-outline-primary')
    })

    it('opens the color select modal when clicking the color preview Card', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      // Find the color preview Card (role=button, title contains 'Selected color')
      const colorCard = screen.getByRole('button', { name: /selected color/i })
      await user.click(colorCard)
      expect(screen.getByText('Choose Primary Color')).toBeInTheDocument()
    })

    it('shows preview section with primary and outline buttons and pagination', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      // Open the color modal by clicking the color preview Card
      const colorCard = screen.getByRole('button', { name: /selected color/i })
      await user.click(colorCard)
      // Preview section
      expect(screen.getByText('Preview')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /primary/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /outline/i })).toBeInTheDocument()
      // Pagination preview
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })
}) 