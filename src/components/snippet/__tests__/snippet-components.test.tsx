import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SnippetCard from '../SnippetCard'
import EmptySnippetList from '../EmptySnippetList'
import SnippetListHeader from '../SnippetListHeader'
import DeleteConfirmationModal from '../DeleteConfirmationModal'
import SnippetLanguageSelector from '../SnippetLanguageSelector'
import SnippetHeader from '../SnippetHeader'

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
  describe('SnippetCard', () => {
    it('renders snippet information', () => {
      render(
        <MemoryRouter>
          <SnippetCard snippet={mockSnippet} />
        </MemoryRouter>
      )
      
      expect(screen.getByText(mockSnippet.title)).toBeInTheDocument()
      expect(screen.getByText(`Language: ${mockSnippet.language}`)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument()
    })
  })

  describe('EmptySnippetList', () => {
    it('renders empty state message', () => {
      render(
        <MemoryRouter>
          <EmptySnippetList />
        </MemoryRouter>
      )
      
      expect(screen.getByText(/no snippets found/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create snippet/i })).toHaveAttribute('href', '/create-snippet')
    })
  })

  describe('SnippetListHeader', () => {
    it('renders header with create button', () => {
      render(
        <MemoryRouter>
          <SnippetListHeader />
        </MemoryRouter>
      )
      
      expect(screen.getAllByText(/my snippets/i)[0]).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /create snippet/i })[0]).toHaveAttribute('href', '/create-snippet')
    })
  })

  describe('DeleteConfirmationModal', () => {
    it('renders modal with confirmation message', () => {
      const handleHide = vi.fn()
      const handleConfirm = vi.fn()
      
      render(
        <DeleteConfirmationModal
          show={true}
          onHide={handleHide}
          onConfirm={handleConfirm}
        />
      )
      
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('handles cancel and confirm actions', () => {
      const handleHide = vi.fn()
      const handleConfirm = vi.fn()
      
      render(
        <DeleteConfirmationModal
          show={true}
          onHide={handleHide}
          onConfirm={handleConfirm}
        />
      )
      
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(handleHide).toHaveBeenCalled()
      
      fireEvent.click(screen.getByRole('button', { name: /delete/i }))
      expect(handleConfirm).toHaveBeenCalled()
    })
  })

  describe('SnippetLanguageSelector', () => {
    it('renders language options', () => {
      const setEditedLanguage = vi.fn()
      render(
        <SnippetLanguageSelector
          isEditing={true}
          editedLanguage="javascript"
          setEditedLanguage={setEditedLanguage}
          language="javascript"
        />
      )
      
      expect(screen.getByRole('combobox')).toHaveValue('javascript')
      expect(screen.getByText(/language/i)).toBeInTheDocument()
    })

    it('handles language change', () => {
      const setEditedLanguage = vi.fn()
      render(
        <SnippetLanguageSelector
          isEditing={true}
          editedLanguage="javascript"
          setEditedLanguage={setEditedLanguage}
          language="javascript"
        />
      )
      
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'python' } })
      expect(setEditedLanguage).toHaveBeenCalledWith('python')
    })
  })

  describe('SnippetHeader', () => {
    it('renders header with title and actions', () => {
      const setIsEditing = vi.fn()
      const setEditedTitle = vi.fn()
      const handleSave = vi.fn()
      const handleCancel = vi.fn()
      const setShowDeleteModal = vi.fn()
      
      render(
        <MemoryRouter>
          <SnippetHeader
            isEditing={false}
            editedTitle="Test Snippet"
            setEditedTitle={setEditedTitle}
            saving={false}
            handleCancel={handleCancel}
            handleSave={handleSave}
            setIsEditing={setIsEditing}
            setShowDeleteModal={setShowDeleteModal}
            title="Test Snippet"
          />
        </MemoryRouter>
      )
      
      expect(screen.getByText('Test Snippet')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('shows edit mode UI', () => {
      const setIsEditing = vi.fn()
      const setEditedTitle = vi.fn()
      const handleSave = vi.fn()
      const handleCancel = vi.fn()
      const setShowDeleteModal = vi.fn()
      
      render(
        <MemoryRouter>
          <SnippetHeader
            isEditing={true}
            editedTitle="Test Snippet"
            setEditedTitle={setEditedTitle}
            saving={false}
            handleCancel={handleCancel}
            handleSave={handleSave}
            setIsEditing={setIsEditing}
            setShowDeleteModal={setShowDeleteModal}
            title="Test Snippet"
          />
        </MemoryRouter>
      )
      
      expect(screen.getByRole('textbox')).toHaveValue('Test Snippet')
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })
}) 