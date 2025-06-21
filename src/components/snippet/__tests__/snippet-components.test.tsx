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
  id: '1',
  title: 'Test Snippet',
  language: 'javascript',
  code: 'console.log("test")',
  created: new Date().toISOString(),
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

    it('shows active filters count badge', () => {
      const props = {
        ...defaultProps,
        language: 'javascript',
        createdAfter: '2024-01-01',
      };
      
      renderWithRouter(<SnippetFilterSection {...props} />);
      
      const badge = screen.getByText('2');
      expect(badge).toBeInTheDocument();
    });
  })
}) 