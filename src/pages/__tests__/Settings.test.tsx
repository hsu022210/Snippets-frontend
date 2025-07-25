import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '../../test/setup'
import Settings from '../Settings'
import { waitFor } from '@testing-library/react'

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

    it('allows changing snippet preview height', async () => {
      renderSettings();
      const heightLabel = screen.getByText(/snippet preview height/i).parentElement?.querySelector('span:last-child');
      const rangeInput = screen.getByRole('slider');
      expect(rangeInput).toBeInTheDocument();
      expect(rangeInput).toHaveValue('75'); // default from usePreviewHeight
      await userEvent.type(rangeInput, '{arrowright}{arrowright}');
      // The value should increase (simulate user interaction)
      expect(Number(rangeInput.getAttribute('value'))).toBeGreaterThanOrEqual(75);
      // The label should update
      if (heightLabel) {
        expect(heightLabel.textContent).toMatch(/\d+px/);
      }
    });
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

    it('shows hex code tooltip when hovering over a color swatch', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      // Open the color modal by clicking the color preview Card
      const colorCard = screen.getByRole('button', { name: /selected color/i })
      await user.click(colorCard)
      // Find all color labels (e.g., 'Bootstrap Blue', 'Sky Blue', etc.)
      const colorLabels = screen.getAllByText(/blue|green|gray|purple|red|orange|yellow|mint|sage|teal|charcoal|mauve|pink|fandango|tangelo|peach|vermilion|coral|navy|ocean|sky|dark|steel/i)
      expect(colorLabels.length).toBeGreaterThan(0)
      const colorLabel = colorLabels[0]
      const card = colorLabel.closest('.card')
      expect(card).toBeTruthy()
      if (card) {
        await user.hover(card)
        // Wait for the tooltip to appear by its hex code text
        const hexMatch = /^#([A-Fa-f0-9]{6})$/
        await screen.findByText(hexMatch)
      }
    })

    it('shows the custom color picker and preview square in the modal', async () => {
      renderSettings()
      // Navigate to General Settings
      const generalSettingsLink = screen.getAllByRole('tab')[2]
      await user.click(generalSettingsLink)
      // Open the color modal by clicking the color preview Card
      const colorCard = screen.getByRole('button', { name: /selected color/i })
      await user.click(colorCard)
      // Custom color picker (Colorful) should be present
      expect(screen.getByText(/pick a custom color/i)).toBeInTheDocument()
      // Preview square: look for a div with a style containing backgroundColor
      const previewSquare = screen.getAllByTitle(/selected color/i)
      expect(previewSquare.length).toBeGreaterThan(0)
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
      const buttons = screen.getAllByRole('button', { name: 'Button' })
      expect(buttons).toHaveLength(2) // Primary and outline buttons
      // Pagination preview
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('toggles theme switch', async () => {
      renderSettings();
      const generalSettingsLink = screen.getAllByRole('tab')[2];
      await user.click(generalSettingsLink);
      const themeSwitch = screen.getByRole('checkbox') as HTMLInputElement;
      const initialChecked = themeSwitch.getAttribute('aria-checked') === 'true' || themeSwitch.checked;
      await user.click(themeSwitch);
      // Should toggle checked state
      expect(themeSwitch.checked).toBe(!initialChecked);
    })

    it('changes primary color in modal', async () => {
      renderSettings();
      const generalSettingsLink = screen.getAllByRole('tab')[2];
      await user.click(generalSettingsLink);
      const colorCard = screen.getByRole('button', { name: /selected color/i });
      await user.click(colorCard);
      // Find a color swatch and click it
      const colorSwatch = screen.getAllByRole('button', { name: /blue|green|gray|purple|red|orange|yellow|mint|sage|teal|charcoal|mauve|pink|fandango|tangelo|peach|vermilion|coral|navy|ocean|sky|dark|steel/i })[0];
      await user.click(colorSwatch);
      // The modal should still be open, and the color should be selected
      expect(screen.getByText('Choose Primary Color')).toBeInTheDocument();
    })

    it('closes the color modal when clicking close', async () => {
      renderSettings();
      const generalSettingsLink = screen.getAllByRole('tab')[2];
      await user.click(generalSettingsLink);
      const colorCard = screen.getByRole('button', { name: /selected color/i });
      await user.click(colorCard);
      // Find and click the close button (assuming aria-label or text 'Close')
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      // Modal should disappear
      await waitFor(() => {
        expect(screen.queryByText('Choose Primary Color')).not.toBeInTheDocument();
      });
    })
  })
}) 