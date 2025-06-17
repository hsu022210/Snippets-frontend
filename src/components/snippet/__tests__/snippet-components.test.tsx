import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '../../../test/setup.tsx'
import SnippetCard from '../SnippetCard'
import EmptySnippetList from '../EmptySnippetList'
import SnippetListHeader from '../SnippetListHeader'
import DeleteConfirmationModal from '../DeleteConfirmationModal'
import SnippetLanguageSelector from '../SnippetLanguageSelector'
import SnippetHeader from '../SnippetHeader'
import { Snippet } from '@/types/interfaces.ts'
import { useTheme } from '../../../contexts/ThemeContext'

// Mock data
const mockSnippet: Snippet = {
  id: '1',
  title: 'Test Snippet',
  language: 'javascript',
  code: 'console.log("test")',
  created: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Mock the useTheme hook
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: vi.fn().mockReturnValue({ isDark: false, toggleTheme: vi.fn() })
}))

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
      expect(screen.getByText(`Language: ${mockSnippet.language}`)).toBeInTheDocument()
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
      vi.mocked(useTheme).mockReturnValue({ isDark: true, toggleTheme: vi.fn() })
      
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
  })

  describe('SnippetListHeader', () => {
    it('renders header with create button', () => {
      render(
        <TestProviders>
          <SnippetListHeader />
        </TestProviders>
      )
      
      expect(screen.getAllByText(/my snippets/i)).toHaveLength(2)
      const createButtons = screen.getAllByRole('button', { name: /create snippet/i })
      expect(createButtons).toHaveLength(2)
      expect(createButtons[0]).toHaveAttribute('href', '/create-snippet')
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
  })
}) 