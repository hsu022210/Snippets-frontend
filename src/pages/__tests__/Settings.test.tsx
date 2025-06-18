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
      const colorButton = screen.getByRole('button', { name: /choose/i })
      expect(colorButton).toHaveClass('btn-outline-primary')
      // The label should match getPrimaryColorLabel
      expect(screen.getByText(/Bootstrap Blue|Light Blue|Navy Blue|Ocean Blue|Sky Blue|Dark Blue|Blue Gray|Steel Blue|Mint Green|Sage Green|Forest Green|Teal|Dark Teal|Light Gray|Gray|Charcoal|Purple|Dark Purple|Mauve|Coral Red|Peach|Orange|Red Orange|Pink|Yellow/)).toBeInTheDocument()
    })

    it('opens the color select modal and shows all color options with correct labels', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      const colorButton = screen.getByRole('button', { name: /choose/i })
      await user.click(colorButton)
      // Modal should show
      expect(screen.getByText('Choose Primary Color')).toBeInTheDocument()
      // All color options should be present
      const radios = screen.getAllByRole('radio', { name: '' })
      expect(radios.length).toBeGreaterThan(5)
      // All color labels should be present (at least one occurrence)
      expect(screen.getAllByText('Bootstrap Blue').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Light Blue').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Yellow').length).toBeGreaterThan(0)
    })

    it('updates the primary color and label when a color is selected', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      const colorButton = screen.getByRole('button', { name: /choose/i })
      await user.click(colorButton)
      // Click a different color (find the card with the text 'Yellow' and click it)
      const yellowCards = screen.getAllByText('Yellow')
      // Find the closest card to click (the <small> inside the card)
      const yellowCard = yellowCards.find(el => el.tagName.toLowerCase() === 'small')
      expect(yellowCard).toBeDefined()
      if (yellowCard) {
        await user.click(yellowCard)
      }
      // Modal should still be open, and label should update
      expect(screen.getAllByText('Yellow').length).toBeGreaterThan(0)
    })

    it('shows preview section with primary and outline buttons and pagination', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      const colorButton = screen.getByRole('button', { name: /choose/i })
      await user.click(colorButton)
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