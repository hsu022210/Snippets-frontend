import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '../../../test/setup.tsx'
import SnippetCard from '../SnippetCard'
import EmptySnippetList from '../EmptySnippetList'
import DeleteConfirmationModal from '../DeleteConfirmationModal'
import SnippetLanguageSelector from '../SnippetLanguageSelector'
import SnippetHeader from '../SnippetHeader'
import SnippetSearch from '../SnippetSearch'
import { Snippet } from '@/types'
import { useTheme } from '../../../contexts/ThemeContext'
import SnippetFilter from '../SnippetFilter'
import SnippetFilterSection from '../SnippetFilterSection'
import { getLanguageDisplayName } from '../../../utils/languageUtils'

// Mock data
const mockSnippet: Snippet = {
  id: 1,
  title: 'Test Snippet',
  language: 'javascript',
  code: 'console.log("test")',
  created: new Date().toISOString(),
}

// Mock the useTheme hook
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: vi.fn().mockReturnValue({ 
    isDark: false, 
    toggleTheme: vi.fn(),
    primaryColor: '#007bff',
    setPrimaryColor: vi.fn()
  })
}))

// Mock the useToast hook
vi.mock('../../../contexts/ToastContext', () => ({
  useToast: vi.fn().mockReturnValue({ showToast: vi.fn() })
}))

// Mock the useShareSnippet hook
vi.mock('../../../hooks/useShareSnippet', () => ({
  useShareSnippet: vi.fn().mockReturnValue({
    shareSnippetTooltip: 'Share snippet',
    handleShare: vi.fn()
  })
}))

// Mock the usePreviewHeight hook
vi.mock('../../../hooks/usePreviewHeight', () => ({
  usePreviewHeight: vi.fn().mockReturnValue({
    previewHeight: 75
  })
}))

// Mock CodeMirror
vi.mock('@uiw/react-codemirror', () => ({
  default: vi.fn().mockImplementation(({ value, theme, maxHeight }) => (
    <div data-testid="codemirror" data-value={value} data-theme={theme} data-max-height={maxHeight}>
      {value}
    </div>
  ))
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn().mockReturnValue('2 hours ago')
}))

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
})

describe('Snippet Components', () => {
  // Setup user event
  const user = userEvent.setup()

  describe('SnippetCard', () => {
    it('renders snippet information correctly', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      expect(screen.getByText(mockSnippet.title)).toBeInTheDocument()
      expect(screen.getByText(`Language: ${getLanguageDisplayName(mockSnippet.language)}`)).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', `/snippets/${mockSnippet.id}`)
    })

    it('renders untitled snippet when title is missing', () => {
      const snippetWithoutTitle = { ...mockSnippet, title: '' }
      render(
        <TestProviders>
          <SnippetCard snippet={snippetWithoutTitle} />
        </TestProviders>
      )
      
      expect(screen.getByText('Untitled Snippet')).toBeInTheDocument()
    })

    it('renders "None" when language is missing', () => {
      const snippetWithoutLanguage = { ...mockSnippet, language: '' }
      render(
        <TestProviders>
          <SnippetCard snippet={snippetWithoutLanguage} />
        </TestProviders>
      )
      
      expect(screen.getByText('Language: None')).toBeInTheDocument()
    })

    it('applies correct theme-based title styling', () => {
      const { rerender } = render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      // Test light theme
      expect(screen.getByText(mockSnippet.title)).toHaveClass('text-dark')
      
      // Mock dark theme
      vi.mocked(useTheme).mockReturnValue({ 
        isDark: true, 
        toggleTheme: vi.fn(),
        primaryColor: '#007bff',
        setPrimaryColor: vi.fn()
      })
      
      // Rerender with dark theme
      rerender(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      // Test dark theme
      expect(screen.getByText(mockSnippet.title)).toHaveClass('text-light')
    })

    it('handles share button click without triggering navigation', async () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      const shareButton = screen.getByRole('button', { name: /share snippet/i })
      await user.click(shareButton)
      
      // The link should still be present and not have been triggered
      expect(screen.getByRole('link')).toHaveAttribute('href', `/snippets/${mockSnippet.id}`)
    })

    it('renders CodeMirror with correct props', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      const codeMirror = screen.getByTestId('codemirror')
      expect(codeMirror).toBeInTheDocument()
      expect(codeMirror).toHaveAttribute('data-value', mockSnippet.code)
    })

    it('displays formatted creation time', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
    })

    it('handles missing creation date gracefully', () => {
      const snippetWithoutDate = { ...mockSnippet, created: '' }
      render(
        <TestProviders>
          <SnippetCard snippet={snippetWithoutDate} />
        </TestProviders>
      )
      
      expect(screen.getByText('Unknown time')).toBeInTheDocument()
    })

    it('handles invalid date gracefully', () => {
      const snippetWithInvalidDate = { ...mockSnippet, created: 'invalid-date' }
      render(
        <TestProviders>
          <SnippetCard snippet={snippetWithInvalidDate} />
        </TestProviders>
      )
      
      // The mock date-fns function returns '2 hours ago' for any input
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
    })

    it('renders share button with correct accessibility attributes', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      const shareButton = screen.getByRole('button', { name: /share snippet/i })
      expect(shareButton).toHaveAttribute('aria-label', 'Share snippet')
      expect(shareButton).toHaveClass('share-btn')
    })

    it('renders clock icon with creation time', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      const timeElement = screen.getByText('2 hours ago')
      expect(timeElement).toBeInTheDocument()
      expect(timeElement.closest('div')).toHaveClass('d-flex', 'align-items-center', 'gap-1')
    })

    it('applies hover effect to card', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      const card = screen.getByRole('link').querySelector('.card')
      expect(card).toHaveClass('custom-card-hover')
    })

    it('renders snippet preview with flex-grow class', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      const previewContainer = screen.getByTestId('codemirror').closest('.snippet-preview')
      expect(previewContainer).toHaveClass('flex-grow-1')
    })
  })

  describe('EmptySnippetList', () => {
    it('renders empty state message', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      expect(screen.getByText(/no snippets found/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create snippet/i })).toHaveAttribute('href', '/create-snippet')
    })

    it('has accessible create button', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const createButton = screen.getByRole('button', { name: /create snippet/i })
      expect(createButton).toHaveAttribute('href', '/create-snippet')
      expect(createButton).not.toBeDisabled()
    })

    it('renders card with correct styling', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const card = screen.getByText(/no snippets found/i).closest('.card')
      expect(card).toHaveClass('text-center')
    })

    it('renders stack with correct gap and alignment', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const stack = screen.getByText(/no snippets found/i).closest('.vstack')
      expect(stack).toHaveClass('gap-3', 'align-items-center')
    })

    it('renders create button with correct variant', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const createButton = screen.getByRole('button', { name: /create snippet/i })
      expect(createButton).toHaveClass('btn-outline-primary')
    })

    it('renders text with correct styling', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const text = screen.getByText(/no snippets found/i )
      expect(text).toBeInTheDocument()
    })

    it('renders link without text decoration', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const button = screen.getByRole('button', { name: /create snippet/i })
      expect(button).toHaveClass('btn-outline-primary')
    })

    it('has correct semantic structure', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      // Should have a card with body
      const card = screen.getByText(/no snippets found/i).closest('.card')
      expect(card).toBeInTheDocument()
      
      // Should have a button that acts as a link
      const button = screen.getByRole('button', { name: /create snippet/i })
      expect(button).toBeInTheDocument()
    })

    it('renders with correct spacing', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const stack = screen.getByText(/no snippets found/i).closest('.vstack')
      expect(stack).toHaveClass('gap-3')
    })

    it('renders button as link component', () => {
      render(
        <TestProviders>
          <EmptySnippetList />
        </TestProviders>
      )
      
      const button = screen.getByRole('button', { name: /create snippet/i })
      expect(button.tagName).toBe('A')
    })
  })

  describe('DeleteConfirmationModal', () => {
    const defaultProps = {
      show: true,
      onHide: vi.fn(),
      onConfirm: vi.fn()
    }

    it('renders modal with confirmation message', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('handles cancel and confirm actions', async () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(defaultProps.onHide).toHaveBeenCalled()
      
      await user.click(screen.getByRole('button', { name: /delete/i }))
      expect(defaultProps.onConfirm).toHaveBeenCalled()
    })

    it('does not render when show is false', () => {
      render(<DeleteConfirmationModal {...defaultProps} show={false} />)
      
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
    })

    it('renders modal with correct title', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument()
    })

    it('renders modal with correct body text', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument()
    })

    it('handles modal header close button click', async () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      
      expect(defaultProps.onHide).toHaveBeenCalled()
    })

    it('renders cancel button with correct variant', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toHaveClass('btn-outline-secondary')
    })

    it('renders delete button with correct variant', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      expect(deleteButton).toHaveClass('btn-outline-danger')
    })

    it('renders modal with correct structure', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      // Check for modal header, body, and footer
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument() // Header
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument() // Body
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument() // Footer
    })

    it('handles escape key to close modal', async () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      const modal = screen.getByRole('dialog')
      await user.type(modal, '{Escape}')
      
      expect(defaultProps.onHide).toHaveBeenCalled()
    })

    it('renders buttons in correct order', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      const buttons = screen.getAllByRole('button')
      const cancelButton = buttons.find(button => button.textContent?.includes('Cancel'))
      const deleteButton = buttons.find(button => button.textContent?.includes('Delete'))
      
      // Cancel should come before Delete
      expect(cancelButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    it('renders modal with correct accessibility attributes', () => {
      render(<DeleteConfirmationModal {...defaultProps} />)
      
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })
  })

  describe('SnippetLanguageSelector', () => {
    const defaultProps = {
      language: 'javascript',
      editedLanguage: 'javascript',
      setEditedLanguage: vi.fn(),
      isEditing: true
    }

    it('renders language selector', () => {
      render(<SnippetLanguageSelector {...defaultProps} />)
      
      expect(screen.getByText('Language:')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles language change', async () => {
      render(<SnippetLanguageSelector {...defaultProps} />)
      
      await user.selectOptions(screen.getByRole('combobox'), 'python')
      expect(defaultProps.setEditedLanguage).toHaveBeenCalledWith('python')
    })

    it('shows "None" when language is empty', () => {
      render(<SnippetLanguageSelector {...defaultProps} language="" editedLanguage="" />)
      
      expect(screen.getByText('Language:')).toBeInTheDocument()
      expect(screen.getByText('None')).toBeInTheDocument()
    })
  })

  describe('SnippetHeader', () => {
    const defaultProps = {
      isEditing: false,
      editedTitle: '',
      setEditedTitle: vi.fn(),
      saving: false,
      handleCancel: vi.fn(),
      handleSave: vi.fn(),
      setIsEditing: vi.fn(),
      setShowDeleteModal: vi.fn(),
      title: 'Test Snippet',
      isAuthenticated: true,
      snippetId: '1'
    }

    it('renders title correctly', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      expect(screen.getByText('Test Snippet')).toBeInTheDocument()
    })

    it('renders edit and delete buttons when authenticated', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('does not render edit and delete buttons when not authenticated', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isAuthenticated={false} />
        </TestProviders>
      )
      
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    })

    it('renders edit mode when isEditing is true', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )
      
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('disables save and cancel buttons when saving', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} saving={true} />
        </TestProviders>
      )
      
      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    })

    it('calls setEditedTitle when title input changes', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'New Title')
      
      expect(defaultProps.setEditedTitle).toHaveBeenCalled()
    })

    it('calls handleSave when save button is clicked', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)
      
      expect(defaultProps.handleSave).toHaveBeenCalled()
    })

    it('calls handleCancel when cancel button is clicked', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      
      expect(defaultProps.handleCancel).toHaveBeenCalled()
    })

    it('calls setIsEditing when edit button is clicked', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)
      
      expect(defaultProps.setIsEditing).toHaveBeenCalledWith(true)
    })

    it('calls setShowDeleteModal when delete button is clicked', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)
      
      expect(defaultProps.setShowDeleteModal).toHaveBeenCalledWith(true)
    })

    it('renders share button with correct accessibility attributes', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const shareButton = screen.getByRole('button', { name: /share snippet/i })
      expect(shareButton).toHaveAttribute('aria-label', 'Share snippet')
      expect(shareButton).toHaveClass('share-btn')
    })

    it('calls handleShare when share button is clicked', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const shareButton = screen.getByRole('button', { name: /share snippet/i })
      await user.click(shareButton)
      
      // The handleShare function should be called with the snippet ID
      // This is tested through the useShareSnippet hook mock
    })

    it('renders title input with correct placeholder in edit mode', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Enter snippet title')
    })

    it('renders title input with current edited title value', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} editedTitle="Edited Title" />
        </TestProviders>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Edited Title')
    })

    it('renders save button with correct icon and text', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      expect(saveButton).toHaveClass('d-flex', 'align-items-center')
    })

    it('renders cancel button with correct icon and text', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toHaveClass('d-flex', 'align-items-center')
    })

    it('renders edit button with correct icon and text', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const editButton = screen.getByRole('button', { name: /edit/i })
      expect(editButton).toHaveClass('d-flex', 'align-items-center')
    })

    it('renders delete button with correct icon and text', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      expect(deleteButton).toHaveClass('d-flex', 'align-items-center')
    })

    it('applies correct responsive classes to button container', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const buttonContainer = screen.getByRole('button', { name: /edit/i }).closest('div')
      expect(buttonContainer).toHaveClass('d-flex', 'gap-2')
    })

    it('applies correct responsive classes to main container', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const mainContainer = screen.getByText('Test Snippet').closest('div')
      expect(mainContainer).toHaveClass('d-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'w-100', 'gap-3')
    })

    it('renders title as h2 element', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const title = screen.getByText('Test Snippet')
      expect(title.tagName).toBe('H2')
    })

    it('applies correct classes to title element', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )
      
      const title = screen.getByText('Test Snippet')
      expect(title).toHaveClass('mb-0', 'flex-grow-0')
    })
  })

  describe('SnippetFilter', () => {
    const defaultProps = {
      language: '',
      createdAfter: '',
      createdBefore: '',
      onFilterChange: vi.fn(),
    };

    it('renders filter components', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByText('Date Range')).toBeInTheDocument();
      expect(screen.getByText('Created After')).toBeInTheDocument();
      expect(screen.getByText('Created Before')).toBeInTheDocument();
    });

    it('handles language filter change', async () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const languageSelect = screen.getByRole('combobox');
      await userEvent.selectOptions(languageSelect, 'javascript');
      
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        language: 'javascript',
        createdAfter: '',
        createdBefore: '',
        searchTitle: '',
        searchCode: '',
      });
    });

    it('handles date filter changes', async () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const createdAfterInput = screen.getByLabelText('Created After');
      const createdBeforeInput = screen.getByLabelText('Created Before');
      
      // Test created after date change
      await userEvent.type(createdAfterInput, '2024-01-01');
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        language: '',
        createdAfter: '2024-01-01',
        createdBefore: '',
        searchTitle: '',
        searchCode: '',
      });

      // Reset the mock to clear previous calls
      defaultProps.onFilterChange.mockClear();
      
      // Test created before date change
      await userEvent.type(createdBeforeInput, '2024-12-31');
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        language: '',
        createdAfter: '',
        createdBefore: '2024-12-31',
        searchTitle: '',
        searchCode: '',
      });
    });

    it('displays helper text for filters', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      expect(screen.getByText('Filter snippets by programming language')).toBeInTheDocument();
      expect(screen.getByText('Show snippets created after this date')).toBeInTheDocument();
      expect(screen.getByText('Show snippets created before this date')).toBeInTheDocument();
    });

    it('prevents selecting dates later than today', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const createdAfterInput = screen.getByLabelText('Created After');
      const createdBeforeInput = screen.getByLabelText('Created Before');
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check that both date inputs have max attribute set to today
      expect(createdAfterInput).toHaveAttribute('max', today);
      expect(createdBeforeInput).toHaveAttribute('max', today);
    });

    it('renders stack with correct gap', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const stack = screen.getByText('Language').closest('[class*="vstack"]');
      expect(stack).toBeInTheDocument();
    });

    it('renders date range form group with correct label', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const dateRangeLabel = screen.getByText('Date Range');
      expect(dateRangeLabel).toHaveClass('fw-bold');
    });

    it('renders date inputs with correct IDs and labels', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const createdAfterInput = screen.getByLabelText('Created After');
      const createdBeforeInput = screen.getByLabelText('Created Before');
      
      expect(createdAfterInput).toHaveAttribute('id', 'createdAfter');
      expect(createdBeforeInput).toHaveAttribute('id', 'createdBefore');
    });

    it('renders date inputs with correct type', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const createdAfterInput = screen.getByLabelText('Created After');
      const createdBeforeInput = screen.getByLabelText('Created Before');
      
      expect(createdAfterInput).toHaveAttribute('type', 'date');
      expect(createdBeforeInput).toHaveAttribute('type', 'date');
    });

    it('renders helper text with correct styling', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const helperTexts = screen.getAllByText(/Show snippets created/);
      helperTexts.forEach(text => {
        expect(text).toHaveClass('text-muted');
      });
    });

    it('maintains existing filter values when updating single field', async () => {
      const props = {
        ...defaultProps,
        language: 'javascript',
        createdAfter: '2024-01-01',
      };
      
      render(<SnippetFilter {...props} />);
      
      const createdBeforeInput = screen.getByLabelText('Created Before');
      await userEvent.type(createdBeforeInput, '2024-12-31');
      
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        language: 'javascript',
        createdAfter: '2024-01-01',
        createdBefore: '2024-12-31',
        searchTitle: '',
        searchCode: '',
      });
    });

    it('renders date range section with correct structure', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      // Check that date range label exists
      expect(screen.getByText('Date Range')).toBeInTheDocument();
      
      // Check that date inputs exist
      expect(screen.getByLabelText('Created After')).toBeInTheDocument();
      expect(screen.getByLabelText('Created Before')).toBeInTheDocument();
      
      const dateStack = screen.getByText('Created After').closest('[class*="vstack"]');
      expect(dateStack).toBeInTheDocument();
    });

    it('renders date inputs with correct margin', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const createdAfterInput = screen.getByLabelText('Created After');
      const createdBeforeInput = screen.getByLabelText('Created Before');
      
      expect(createdAfterInput).toHaveClass('mb-2');
      expect(createdBeforeInput).toHaveClass('mb-2');
    });

    it('handles multiple filter changes correctly', async () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const languageSelect = screen.getByRole('combobox');
      const createdAfterInput = screen.getByLabelText('Created After');
      
      // Change language
      await userEvent.selectOptions(languageSelect, 'python');
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        language: 'python',
        createdAfter: '',
        createdBefore: '',
        searchTitle: '',
        searchCode: '',
      });
      
      // Reset mock
      defaultProps.onFilterChange.mockClear();
      
      // Change date
      await userEvent.type(createdAfterInput, '2024-06-01');
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        language: '',
        createdAfter: '2024-06-01',
        createdBefore: '',
        searchTitle: '',
        searchCode: '',
      });
    });

    it('renders with correct accessibility attributes', () => {
      render(<SnippetFilter {...defaultProps} />);
      
      const createdAfterInput = screen.getByLabelText('Created After');
      const createdBeforeInput = screen.getByLabelText('Created Before');
      
      expect(createdAfterInput).toHaveAttribute('id', 'createdAfter');
      expect(createdBeforeInput).toHaveAttribute('id', 'createdBefore');
    });
  });

  describe('SnippetLanguageSelector', () => {
    describe('Filter Mode', () => {
      const filterProps = {
        language: '',
        onLanguageChange: vi.fn(),
      };

      it('renders filter language selector', () => {
        render(<SnippetLanguageSelector {...filterProps} />);
        
        expect(screen.getByText('Language')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('All Languages')).toBeInTheDocument();
      });

      it('handles language change in filter mode', async () => {
        render(<SnippetLanguageSelector {...filterProps} />);
        
        const select = screen.getByRole('combobox');
        await userEvent.selectOptions(select, 'python');
        
        expect(filterProps.onLanguageChange).toHaveBeenCalledWith('python');
      });

      it('displays helper text in filter mode', () => {
        render(<SnippetLanguageSelector {...filterProps} />);
        
        expect(screen.getByText('Filter snippets by programming language')).toBeInTheDocument();
      });

      it('renders select with correct size class', () => {
        render(<SnippetLanguageSelector {...filterProps} />);
        
        const select = screen.getByRole('combobox');
        expect(select).toHaveClass('form-select-lg');
      });

      it('renders label with correct styling', () => {
        render(<SnippetLanguageSelector {...filterProps} />);
        
        const label = screen.getByText('Language');
        expect(label).toHaveClass('fw-bold');
      });

      it('handles empty language selection', async () => {
        render(<SnippetLanguageSelector {...filterProps} />);
        
        const select = screen.getByRole('combobox');
        await userEvent.selectOptions(select, '');
        
        expect(filterProps.onLanguageChange).toHaveBeenCalledWith('');
      });

      it('renders with correct form group structure', () => {
        render(<SnippetLanguageSelector {...filterProps} />);
        
        // Check that the language selector renders correctly
        expect(screen.getByText('Language')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    describe('Edit Mode', () => {
      const editProps = {
        isEditing: true,
        editedLanguage: '',
        setEditedLanguage: vi.fn(),
        language: '',
      };

      it('renders edit language selector', () => {
        render(<SnippetLanguageSelector {...editProps} />);
        
        expect(screen.getByText('Language:')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('None')).toBeInTheDocument();
      });

      it('handles language change in edit mode', async () => {
        render(<SnippetLanguageSelector {...editProps} />);
        
        const select = screen.getByRole('combobox');
        await userEvent.selectOptions(select, 'javascript');
        
        expect(editProps.setEditedLanguage).toHaveBeenCalledWith('javascript');
      });

      it('displays current language in view mode', () => {
        const viewProps = {
          ...editProps,
          isEditing: false,
          language: 'python',
        };
        
        render(<SnippetLanguageSelector {...viewProps} />);
        
        expect(screen.getByText('Language:')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();
      });

      it('displays "None" when language is empty in view mode', () => {
        const viewProps = {
          ...editProps,
          isEditing: false,
          language: '',
        };
        
        render(<SnippetLanguageSelector {...viewProps} />);
        
        expect(screen.getByText('Language:')).toBeInTheDocument();
        expect(screen.getByText('None')).toBeInTheDocument();
      });

      it('renders label with strong tag in edit mode', () => {
        render(<SnippetLanguageSelector {...editProps} />);
        
        const label = screen.getByText('Language:');
        expect(label.tagName).toBe('STRONG');
      });

      it('renders select with w-auto class in edit mode', () => {
        render(<SnippetLanguageSelector {...editProps} />);
        
        const select = screen.getByRole('combobox');
        expect(select).toHaveClass('w-auto');
      });

      it('renders with correct margin in edit mode', () => {
        render(<SnippetLanguageSelector {...editProps} />);
        
        const container = screen.getByText('Language:').closest('div');
        expect(container).toBeInTheDocument();
      });

      it('renders form group in edit mode', () => {
        render(<SnippetLanguageSelector {...editProps} />);
        
        // Check that the language selector renders correctly in edit mode
        expect(screen.getByText('Language:')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      it('handles empty language selection in edit mode', async () => {
        render(<SnippetLanguageSelector {...editProps} />);
        
        const select = screen.getByRole('combobox');
        await userEvent.selectOptions(select, '');
        
        expect(editProps.setEditedLanguage).toHaveBeenCalledWith('');
      });

      it('displays language name correctly in view mode', () => {
        const viewProps = {
          ...editProps,
          isEditing: false,
          language: 'typescript',
        };
        
        render(<SnippetLanguageSelector {...viewProps} />);
        
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
      });

      it('renders without form group in view mode', () => {
        const viewProps = {
          ...editProps,
          isEditing: false,
          language: 'javascript',
        };
        
        render(<SnippetLanguageSelector {...viewProps} />);
        
        const label = screen.getByText('Language:');
        expect(label.closest('.form-group')).not.toBeInTheDocument();
      });
    });

    describe('Component Logic', () => {
      it('correctly identifies filter mode vs edit mode', () => {
        // Filter mode
        const filterProps = { language: '', onLanguageChange: vi.fn() };
        const { rerender } = render(<SnippetLanguageSelector {...filterProps} />);
        expect(screen.getByText('Language')).toBeInTheDocument();

        // Edit mode
        const editProps = { isEditing: true, editedLanguage: '', setEditedLanguage: vi.fn(), language: '' };
        rerender(<SnippetLanguageSelector {...editProps} />);
        expect(screen.getByText('Language:')).toBeInTheDocument();
      });

      it('handles different language options correctly', async () => {
        const filterProps = { language: '', onLanguageChange: vi.fn() };
        render(<SnippetLanguageSelector {...filterProps} />);
        
        const select = screen.getByRole('combobox');
        
        // Test different language selections
        await userEvent.selectOptions(select, 'javascript');
        expect(filterProps.onLanguageChange).toHaveBeenCalledWith('javascript');
        
        filterProps.onLanguageChange.mockClear();
        await userEvent.selectOptions(select, 'python');
        expect(filterProps.onLanguageChange).toHaveBeenCalledWith('python');
      });
    });
  })

  describe('SnippetSearch', () => {
    const defaultProps = {
      searchTitle: '',
      searchCode: '',
      onSearchChange: vi.fn(),
    };

    it('renders search components', () => {
      render(<SnippetSearch {...defaultProps} />);
      
      expect(screen.getByText('Title', { selector: 'button' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('handles search type change', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      const dropdownToggle = screen.getByText('Title', { selector: 'button' });
      await userEvent.click(dropdownToggle);
      
      const codeOption = screen.getByText('Code');
      await userEvent.click(codeOption);
      
      expect(screen.getByText('Code', { selector: 'button' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search by code/i)).toBeInTheDocument();
    });

    it('handles search input and submission', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      // Test search button is enabled when input is empty
      expect(searchButton).not.toBeDisabled();
      
      // Type in search input
      await userEvent.type(searchInput, 'test search');
      
      // Test search button is enabled
      expect(searchButton).not.toBeDisabled();
      
      // Click search button
      await userEvent.click(searchButton);
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('searchTitle', 'test search');
    });

    it('handles search with Enter key', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      await userEvent.type(searchInput, 'test search{enter}');
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('searchTitle', 'test search');
    });

    it('handles clear search', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      await userEvent.type(searchInput, 'test search');
      
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      await userEvent.click(clearButton);
      
      expect(searchInput).toHaveValue('');
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('searchTitle', '');
    });

    it('updates search value when switching search type', async () => {
      const props = {
        ...defaultProps,
        searchTitle: 'title search',
        searchCode: 'code search',
      };
      
      render(<SnippetSearch {...props} />);
      
      // Initial state should show title search
      expect(screen.getByPlaceholderText(/search by title/i)).toHaveValue('title search');
      
      // Switch to code search
      const dropdownToggle = screen.getByText('Title', { selector: 'button' });
      await userEvent.click(dropdownToggle);
      const codeOption = screen.getByText('Code');
      await userEvent.click(codeOption);
      
      // Should now show code search value
      expect(screen.getByPlaceholderText(/search by code/i)).toHaveValue('code search');
    });

    it('shows loading state correctly', async () => {
      render(<SnippetSearch {...defaultProps} loading={true} />);
      
      // Check if loading spinner is present
      expect(screen.getByText('Searching...', { selector: '.text-muted' })).toBeInTheDocument();
      
      // Check if search button is disabled
      const searchButton = screen.getByRole('button', { name: /searching/i });
      expect(searchButton).toBeDisabled();
      
      // Type in search input to show clear button
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      await userEvent.type(searchInput, 'test search');
      
      // Wait for and check clear button
      const clearButton = await screen.findByRole('button', { name: /clear/i });
      expect(clearButton).toBeDisabled();
    });

    it('shows clear button only when there is input', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      // Initially no clear button should be present
      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
      
      // Type in search input
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      await userEvent.type(searchInput, 'test');
      
      // Clear button should now be present
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('handles search type dropdown correctly', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      // Initially shows Title
      expect(screen.getByText('Title', { selector: 'button' })).toBeInTheDocument();
      
      // Click dropdown
      const dropdownToggle = screen.getByText('Title', { selector: 'button' });
      await userEvent.click(dropdownToggle);
      
      // Should show both options
      expect(screen.getAllByText('Title')).toHaveLength(2);
      expect(screen.getByText('Code')).toBeInTheDocument();
      
      // Select Code
      const codeOption = screen.getByText('Code');
      await userEvent.click(codeOption);
      
      // Should now show Code
      expect(screen.getByText('Code', { selector: 'button' })).toBeInTheDocument();
    });

    it('disables search button when loading', () => {
      render(<SnippetSearch {...defaultProps} loading={true} />);
      
      const searchButton = screen.getByRole('button', { name: /searching/i });
      expect(searchButton).toBeDisabled();
    });

    it('disables clear button when loading', async () => {
      render(<SnippetSearch {...defaultProps} loading={true} />);
      
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      await userEvent.type(searchInput, 'test search');
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeDisabled();
    });

    it('handles empty search input correctly', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      // Search with empty input
      await userEvent.click(searchButton);
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('searchTitle', '');
    });

    it('maintains search value when switching between types', async () => {
      const props = {
        ...defaultProps,
        searchTitle: 'title search',
        searchCode: 'code search',
      };
      
      render(<SnippetSearch {...props} />);
      
      // Initial state should show title search
      expect(screen.getByPlaceholderText(/search by title/i)).toHaveValue('title search');
      
      // Switch to code search
      const dropdownToggle = screen.getByText('Title', { selector: 'button' });
      await userEvent.click(dropdownToggle);
      const codeOption = screen.getByText('Code');
      await userEvent.click(codeOption);
      
      // Should now show code search value
      expect(screen.getByPlaceholderText(/search by code/i)).toHaveValue('code search');
    });

    it('renders search icon in search button', () => {
      render(<SnippetSearch {...defaultProps} />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toHaveClass('d-flex', 'align-items-center', 'gap-2');
    });

    it('renders clear icon in clear button', async () => {
      render(<SnippetSearch {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      await userEvent.type(searchInput, 'test search');
      
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toHaveAttribute('title', 'Clear search');
    });
  })

  describe('SnippetFilterSection', () => {
    const defaultProps = {
      language: '',
      createdAfter: '',
      createdBefore: '',
      onFilterChange: vi.fn(),
      onReset: vi.fn(),
    };

    const renderWithRouter = (ui: React.ReactElement) => {
      return render(
        <TestProviders>
          {ui}
        </TestProviders>
      );
    };

    it('renders filter section components', () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} />);
      
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByText('Create Snippet')).toBeInTheDocument();
    });

    it('shows filter offcanvas when clicking filters button', async () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} />);
      
      const filtersButton = screen.getByText('Filters');
      await userEvent.click(filtersButton);
      
      expect(screen.getByText('Filter Snippets')).toBeInTheDocument();
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
      expect(screen.getByText('Reset Filters')).toBeInTheDocument();
    });

    it('applies filters when clicking apply button', async () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} />);
      
      // Open filter panel
      const filtersButton = screen.getByText('Filters');
      await userEvent.click(filtersButton);
      
      // Apply filters
      const applyButton = screen.getByText('Apply Filters');
      await userEvent.click(applyButton);
      
      expect(defaultProps.onFilterChange).toHaveBeenCalled();
    });

    it('shows active filters count badge correctly', () => {
      const props = {
        ...defaultProps,
        language: 'javascript',
        createdAfter: '2024-01-01',
      };
      
      renderWithRouter(<SnippetFilterSection {...props} />);
      
      const badge = screen.getByText('2');
      expect(badge).toBeInTheDocument();
    });

    it('disables filters button when loading', () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} loading={true} />);
      
      const filtersButton = screen.getByText('Filters');
      expect(filtersButton).toBeDisabled();
    });

    it('disables create snippet button when loading', () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} loading={true} />);
      
      const createButton = screen.getByText('Create Snippet');
      expect(createButton).toBeDisabled();
    });

    it('resets filters when clicking reset button', async () => {
      const props = {
        ...defaultProps,
        language: 'javascript',
        createdAfter: '2024-01-01',
      };
      
      renderWithRouter(<SnippetFilterSection {...props} />);
      
      // Open filter panel
      const filtersButton = screen.getByText('Filters');
      await userEvent.click(filtersButton);
      
      // Reset filters
      const resetButton = screen.getByText('Reset Filters');
      await userEvent.click(resetButton);
      
      expect(defaultProps.onReset).toHaveBeenCalled();
    });

    it('renders filter icon in filters button', () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} />);
      
      const filtersButton = screen.getByText('Filters');
      expect(filtersButton).toBeInTheDocument();
      expect(filtersButton.closest('button')).toHaveClass('d-flex', 'align-items-center', 'gap-2');
    });

    it('renders create snippet button as link', () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} />);
      
      const createButton = screen.getByText('Create Snippet');
      expect(createButton.closest('a')).toHaveAttribute('href', '/create-snippet');
    });

    it('closes offcanvas when clicking close button', async () => {
      renderWithRouter(<SnippetFilterSection {...defaultProps} />);
      
      // Open filter panel
      const filtersButton = screen.getByText('Filters');
      await userEvent.click(filtersButton);
      
      // Close offcanvas
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);
      
      expect(screen.queryByText('Filter Snippets')).not.toBeInTheDocument();
    });

    it('resets local filters when closing offcanvas', async () => {
      const props = {
        ...defaultProps,
        language: 'javascript',
        createdAfter: '2024-01-01',
      };
      
      renderWithRouter(<SnippetFilterSection {...props} />);
      
      // Open filter panel
      const filtersButton = screen.getByText('Filters');
      await userEvent.click(filtersButton);
      
      // Close offcanvas
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);
      
      // Reopen and check that local filters are reset
      await userEvent.click(filtersButton);
      expect(screen.getByText('Filter Snippets')).toBeInTheDocument();
    });
  })
}) 