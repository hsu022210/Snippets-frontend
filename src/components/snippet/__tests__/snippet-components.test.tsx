import React from 'react'
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

// Mock data
const mockSnippet = {
  id: '1',
  title: 'Test Snippet',
  description: 'Test Description',
  language: 'javascript',
  code: 'console.log("test")',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

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
      expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument()
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

    it('has correct link to snippet details', () => {
      render(
        <TestProviders>
          <SnippetCard snippet={mockSnippet} />
        </TestProviders>
      )
      
      const link = screen.getByRole('button', { name: /view details/i })
      expect(link).toHaveAttribute('href', `/snippets/${mockSnippet.id}`)
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
      isAuthenticated: true
    }

    it('renders title and action buttons when not editing', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )

      expect(screen.getByText('Test Snippet')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /share snippet/i })).toBeInTheDocument()
    })

    it('hides edit and delete buttons when user is not authenticated', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isAuthenticated={false} />
        </TestProviders>
      )

      expect(screen.getByText('Test Snippet')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /share snippet/i })).toBeInTheDocument()
    })

    it('shows editing form when isEditing is true', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )

      expect(screen.getByPlaceholderText('Enter snippet title')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('shows saving state when saving is true', () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} saving={true} />
        </TestProviders>
      )

      expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument()
    })

    it('handles edit button click', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )

      await user.click(screen.getByRole('button', { name: /edit/i }))
      expect(defaultProps.setIsEditing).toHaveBeenCalledWith(true)
    })

    it('handles delete button click', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} />
        </TestProviders>
      )

      await user.click(screen.getByRole('button', { name: /delete/i }))
      expect(defaultProps.setShowDeleteModal).toHaveBeenCalledWith(true)
    })

    it('handles save button click', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )

      await user.click(screen.getByRole('button', { name: /save/i }))
      expect(defaultProps.handleSave).toHaveBeenCalled()
    })

    it('handles cancel button click', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )

      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(defaultProps.handleCancel).toHaveBeenCalled()
    })

    it('handles title input change', async () => {
      render(
        <TestProviders>
          <SnippetHeader {...defaultProps} isEditing={true} />
        </TestProviders>
      )

      const input = screen.getByPlaceholderText('Enter snippet title')
      await user.type(input, 'New Title')
      expect(defaultProps.setEditedTitle).toHaveBeenCalled()
    })
  })
}) 