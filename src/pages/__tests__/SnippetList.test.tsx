import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SnippetList from '../SnippetList';
import { TestProviders } from '../../test/setup';
import { useSnippetList } from '../../hooks/useSnippetList';
import { useFilterState } from '../../hooks/useFilterState';
import { Snippet, SnippetFilterValues } from '../../types';

// Mock the hooks
vi.mock('../../hooks/useSnippetList');
vi.mock('../../hooks/useFilterState');

// Mock the components
vi.mock('../../components/snippet/SnippetCard', () => ({
  default: ({ snippet }: { snippet: Snippet }) => (
    <div data-testid={`snippet-card-${snippet.id}`}>
      {snippet.title} - {snippet.language}
    </div>
  ),
}));

vi.mock('../../components/snippet/EmptySnippetList', () => ({
  default: () => <div data-testid="empty-snippet-list">No snippets found</div>,
}));

vi.mock('../../components/snippet/SnippetFilterSection', () => ({
  default: ({ onFilterChange, onReset, loading }: { 
    onFilterChange: (filters: SnippetFilterValues) => void;
    onReset: () => void;
    loading?: boolean;
  }) => (
    <div data-testid="snippet-filter-section">
      <button 
        onClick={() => onFilterChange({ language: 'javascript', createdAfter: '', createdBefore: '', searchTitle: '', searchCode: '' })}
        disabled={loading}
      >
        Apply Filter
      </button>
      <button onClick={onReset} disabled={loading}>Reset Filters</button>
    </div>
  ),
}));

vi.mock('../../components/snippet/SnippetSearch', () => ({
  default: ({ onSearchChange, loading }: { 
    onSearchChange: (field: 'searchTitle' | 'searchCode', value: string) => void;
    loading?: boolean;
  }) => (
    <div data-testid="snippet-search">
      <input
        data-testid="search-title-input"
        placeholder="Search by title"
        onChange={(e) => onSearchChange('searchTitle', e.target.value)}
        disabled={loading}
      />
      <input
        data-testid="search-code-input"
        placeholder="Search by code"
        onChange={(e) => onSearchChange('searchCode', e.target.value)}
        disabled={loading}
      />
    </div>
  ),
}));

const mockSnippets: Snippet[] = [
  {
    id: 1,
    title: 'React Component',
    code: 'function App() { return <div>Hello</div>; }',
    language: 'javascript',
    created: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Python Function',
    code: 'def hello(): print("Hello")',
    language: 'python',
    created: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'CSS Styles',
    code: '.container { display: flex; }',
    language: 'css',
    created: '2024-01-03T00:00:00Z',
  },
];

const renderSnippetList = () =>
  render(
    <TestProviders>
      <SnippetList />
    </TestProviders>
  );

describe('SnippetList', () => {
  const mockUseSnippetList = vi.mocked(useSnippetList);
  const mockUseFilterState = vi.mocked(useFilterState);

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseFilterState.mockReturnValue({
      filters: {
        language: '',
        createdAfter: '',
        createdBefore: '',
        searchTitle: '',
        searchCode: '',
      },
      updateFilters: vi.fn(),
      resetFilters: vi.fn(),
    });

    mockUseSnippetList.mockReturnValue({
      snippets: mockSnippets,
      totalCount: 3,
      loading: false,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      mockUseSnippetList.mockReturnValue({
        snippets: [],
        totalCount: 0,
        loading: true,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      renderSnippetList();
      
      expect(screen.getAllByText('Loading snippets...')).toHaveLength(2); // One visually hidden, one visible
    });
  });

  describe('Header and Count Display', () => {
    it('displays the correct header and total count', () => {
      renderSnippetList();
      
      expect(screen.getByRole('heading', { name: /my snippets/i })).toBeInTheDocument();
      expect(screen.getByText('Total: 3')).toBeInTheDocument();
    });

    it('shows filtered count when filters are active', () => {
      mockUseFilterState.mockReturnValue({
        filters: {
          language: 'javascript',
          createdAfter: '',
          createdBefore: '',
          searchTitle: '',
          searchCode: '',
        },
        updateFilters: vi.fn(),
        resetFilters: vi.fn(),
      });

      renderSnippetList();
      
      expect(screen.getByText('Filtered: 3')).toBeInTheDocument();
    });
  });

  describe('Snippet Grid', () => {
    it('renders snippet cards for each snippet', () => {
      renderSnippetList();
      
      expect(screen.getByTestId('snippet-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('snippet-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('snippet-card-3')).toBeInTheDocument();
    });

    it('shows empty state when no snippets', () => {
      mockUseSnippetList.mockReturnValue({
        snippets: [],
        totalCount: 0,
        loading: false,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      renderSnippetList();
      
      expect(screen.getByTestId('empty-snippet-list')).toBeInTheDocument();
      expect(screen.queryByTestId('snippet-card-1')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('renders search inputs', () => {
      renderSnippetList();
      
      expect(screen.getByTestId('snippet-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-title-input')).toBeInTheDocument();
      expect(screen.getByTestId('search-code-input')).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('renders filter section', () => {
      renderSnippetList();
      
      expect(screen.getByTestId('snippet-filter-section')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('does not show pagination when only one page', () => {
      renderSnippetList();
      
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('shows pagination when multiple pages exist', () => {
      mockUseSnippetList.mockReturnValue({
        snippets: mockSnippets,
        totalCount: 30, // More than page size
        loading: false,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      renderSnippetList();
      
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('shows correct pagination controls for middle page', () => {
      mockUseSnippetList.mockReturnValue({
        snippets: mockSnippets,
        totalCount: 30,
        loading: false,
        hasNextPage: true,
        hasPreviousPage: true,
      });

      renderSnippetList();
      
      // Check that both Previous and Next buttons are present and enabled
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      mockUseSnippetList.mockReturnValue({
        snippets: mockSnippets,
        totalCount: 30,
        loading: false,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      renderSnippetList();
      
      // The previous button should be disabled (wrapped in a span instead of an anchor)
      const paginationList = screen.getByRole('list');
      const firstListItem = paginationList.firstElementChild;
      expect(firstListItem).toHaveClass('disabled');
    });

    it('disables next button on last page', () => {
      mockUseSnippetList.mockReturnValue({
        snippets: mockSnippets,
        totalCount: 30,
        loading: false,
        hasNextPage: false,
        hasPreviousPage: true,
      });

      renderSnippetList();
      
      // The next button should be disabled (wrapped in a span instead of an anchor)
      const paginationList = screen.getByRole('list');
      const lastListItem = paginationList.lastElementChild;
      expect(lastListItem).toHaveClass('disabled');
    });
  });

  describe('Component Integration', () => {
    it('renders all major sections when data is available', () => {
      renderSnippetList();
      
      // Header
      expect(screen.getByRole('heading', { name: /my snippets/i })).toBeInTheDocument();
      
      // Search
      expect(screen.getByTestId('snippet-search')).toBeInTheDocument();
      
      // Filters
      expect(screen.getByTestId('snippet-filter-section')).toBeInTheDocument();
      
      // Snippets
      expect(screen.getByTestId('snippet-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('snippet-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('snippet-card-3')).toBeInTheDocument();
    });

    it('handles empty state correctly', () => {
      mockUseSnippetList.mockReturnValue({
        snippets: [],
        totalCount: 0,
        loading: false,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      renderSnippetList();
      
      expect(screen.getByText('Total: 0')).toBeInTheDocument();
      expect(screen.getByTestId('empty-snippet-list')).toBeInTheDocument();
      expect(screen.queryByTestId('snippet-card-1')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderSnippetList();
      
      const heading = screen.getByRole('heading', { name: /my snippets/i });
      expect(heading.tagName).toBe('H2');
    });

    it('has proper button labels', () => {
      renderSnippetList();
      
      const filterButtons = screen.getAllByRole('button');
      filterButtons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });
}); 