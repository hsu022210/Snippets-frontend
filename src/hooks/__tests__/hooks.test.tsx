import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useApiRequest } from '../useApiRequest'
import { useSnippetList } from '../useSnippetList'
import { useSnippet, useCreateSnippet } from '../useSnippet'
import { useShareSnippet } from '../useShareSnippet'
import { useFilterState } from '../useFilterState'
import { usePreviewHeight } from '../usePreviewHeight'
import { TestProviders } from '../../test/setup'
import { http, HttpResponse } from 'msw'
import axios from 'axios'
import { localStorageMock } from '../../test/setup'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { ToastProvider } from '../../contexts/ToastContext'

// Mock the toast context
const mockShowToast = vi.fn();
const mockHideToast = vi.fn();
vi.mock('../../contexts/ToastContext', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useToast: () => ({
      showToast: mockShowToast,
      hideToast: mockHideToast,
    }),
  };
});

// Types
interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
}

interface SnippetData {
  title: string;
  code: string;
  language: string;
}

// Test utilities
const CustomRouterProviders = ({ children, initialEntries }: { children: React.ReactNode, initialEntries: string[] }) => (
  <ToastProvider>
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </ThemeProvider>
  </ToastProvider>
);

const defaultFilters = {
  language: '',
  createdAfter: '',
  createdBefore: '',
  searchTitle: '',
  searchCode: '',
  page: '',
};

const mockSnippetData: SnippetData = {
  title: 'New Snippet',
  code: 'console.log("new")',
  language: 'javascript'
};

// Test helpers
const setupClipboardMock = (writeText: ReturnType<typeof vi.fn>) => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
  });
};

describe('Hooks (with MSW)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('useApiRequest', () => {
    it('should handle successful API request', async () => {
      const { result } = renderHook(() => useApiRequest(), {
        wrapper: TestProviders,
      });

      let response: { data: { id: number; title: string } } | undefined;
      await act(async () => {
        response = await result.current.makeRequest(() => axios.get('/snippets/1'));
      });

      expect(response?.data.id).toBe(1);
      expect(response?.data.title).toBe('Test Snippet');
    });

    it('should handle API request error', async () => {
      const { result } = renderHook(() => useApiRequest(), {
        wrapper: TestProviders,
      });

      let response;
      await act(async () => {
        try {
          response = await result.current.makeRequest(() => axios.get('/snippets/1/error'));
        } catch {
          // Error is expected
        }
      });

      expect(response).toBeUndefined();
    });
  });

  describe('useSnippetList', () => {
    it('should fetch and return snippets with total count', async () => {
      const { result } = renderHook(() => useSnippetList(), {
        wrapper: TestProviders,
      });
      
      expect(result.current.loading).toBe(true);
      expect(result.current.snippets).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.snippets.length).toBeGreaterThan(0);
      expect(result.current.totalCount).toBeGreaterThan(0);
      const snippet = result.current.snippets[0] as Snippet;
      expect(snippet.id).toBe(1);
    });

    it('should handle fetch error', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.get('/snippets', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      
      const { result } = renderHook(() => useSnippetList(), {
        wrapper: TestProviders,
      });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(mockShowToast).toHaveBeenCalledWith('Failed to fetch snippets', 'danger');
      expect(result.current.snippets).toEqual([]);
      expect(result.current.totalCount).toBe(0);
    });

    it('should filter snippets by language', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('language')).toBe('javascript');
          return HttpResponse.json({
            results: [
              { id: 1, title: 'JS Snippet', code: 'console.log("test")', language: 'javascript' }
            ]
          });
        })
      );

      const { result } = renderHook(() => useSnippetList({ language: 'javascript' }), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.snippets.length).toBe(1);
      expect(result.current.snippets[0].language).toBe('javascript');
    });

    it('should filter snippets by date range', async () => {
      const { server } = await import('../../test/setup');
      const createdAfter = '2024-01-01';
      const createdBefore = '2024-12-31';
      
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('created_after')).toBe(createdAfter);
          expect(url.searchParams.get('created_before')).toBe(createdBefore);
          return HttpResponse.json({
            results: [
              { id: 1, title: 'Date Filtered Snippet', code: 'test', language: 'python' }
            ]
          });
        })
      );

      const { result } = renderHook(() => useSnippetList({ 
        createdAfter,
        createdBefore
      }), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.snippets.length).toBe(1);
    });

    it('should filter snippets by search terms', async () => {
      const { server } = await import('../../test/setup');
      const searchTitle = 'test';
      const searchCode = 'console.log';
      
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('search_title')).toBe(searchTitle);
          expect(url.searchParams.get('search_code')).toBe(searchCode);
          return HttpResponse.json({
            results: [
              { id: 1, title: 'Test Snippet', code: 'console.log("test")', language: 'javascript' }
            ]
          });
        })
      );

      const { result } = renderHook(() => useSnippetList({ 
        searchTitle,
        searchCode
      }), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.snippets.length).toBe(1);
      expect(result.current.snippets[0].title.toLowerCase()).toContain(searchTitle);
    });

    it('should handle empty results', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.get('/snippets', () => {
          return HttpResponse.json({
            results: [],
            count: 0
          });
        })
      );

      const { result } = renderHook(() => useSnippetList(), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.snippets).toEqual([]);
      expect(result.current.totalCount).toBe(0);
    });

    it('should handle pagination', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('page')).toBe('2');
          return HttpResponse.json({
            results: [
              { id: 3, title: 'Page 2 Snippet', code: 'test', language: 'python' }
            ],
            count: 3,
            next: null,
            previous: '/snippets?page=1'
          });
        })
      );

      const { result } = renderHook(() => useSnippetList({}, 2), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.snippets.length).toBe(1);
      expect(result.current.snippets[0].id).toBe(3);
      expect(result.current.hasPreviousPage).toBe(true);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe('useSnippet', () => {
    it('should fetch snippet by ID', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.snippet).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.snippet).toBeTruthy();
      expect(result.current.snippet?.id).toBe(1);
      expect(result.current.snippet?.title).toBe('Test Snippet');
    });

    it('should handle snippet fetch error', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.get('/snippets/999', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const { result } = renderHook(() => useSnippet(999), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockShowToast).toHaveBeenCalledWith('Request failed with status code 404', 'danger');
      expect(result.current.snippet).toBeNull();
    });

    it('should handle snippet save', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setIsEditing(true);
        result.current.setEditedTitle('Updated Title');
        result.current.setEditedCode('console.log("updated")');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockShowToast).toHaveBeenCalledWith('Snippet saved successfully!', 'primary', 3);
      expect(result.current.isEditing).toBe(false);
    });

    it('should handle snippet save error', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.patch('/snippets/1/', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setIsEditing(true);
        result.current.setEditedTitle('Updated Title');
        result.current.setEditedCode('console.log("updated")');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockShowToast).toHaveBeenCalledWith('Request failed with status code 500', 'danger');
      expect(result.current.isEditing).toBe(true);
    });

    it('should handle snippet deletion', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockShowToast).toHaveBeenCalledWith('Snippet deleted successfully!', 'primary', 3);
    });

    it('should handle snippet deletion error', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.delete('/snippets/1', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockShowToast).toHaveBeenCalledWith('Request failed with status code 500', 'danger');
    });

    it('should handle cancel edit', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setIsEditing(true);
        result.current.setEditedTitle('Modified Title');
        result.current.setEditedCode('modified code');
      });

      expect(result.current.isEditing).toBe(true);
      expect(result.current.editedTitle).toBe('Modified Title');

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.isEditing).toBe(false);
      expect(result.current.editedTitle).toBe('Test Snippet');
    });
  });

  describe('useCreateSnippet', () => {
    it('should create snippet successfully', async () => {
      const { result } = renderHook(() => useCreateSnippet(), {
        wrapper: TestProviders,
      });

      await act(async () => {
        await result.current.createSnippet(mockSnippetData);
      });

      expect(mockShowToast).toHaveBeenCalledWith('Snippet created successfully!', 'primary', 3);
      expect(result.current.loading).toBe(false);
    });

    it('should handle create snippet error', async () => {
      const { server } = await import('../../test/setup');
      server.use(
        http.post('/snippets', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useCreateSnippet(), {
        wrapper: TestProviders,
      });

      await act(async () => {
        try {
          await result.current.createSnippet(mockSnippetData);
        } catch {
          // Error is expected
        }
      });

      expect(mockShowToast).toHaveBeenCalledWith('Request failed with status code 500', 'danger');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useShareSnippet', () => {
    it('should share snippet successfully', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      setupClipboardMock(mockWriteText);

      const { result } = renderHook(() => useShareSnippet());

      await act(async () => {
        await result.current.handleShare('123');
      });

      expect(mockWriteText).toHaveBeenCalledWith(`${window.location.origin}/snippets/123`);
      expect(mockShowToast).toHaveBeenCalledWith('Link copied to clipboard!', undefined, 2);
    });

    it('should handle share error', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard error'));
      setupClipboardMock(mockWriteText);

      const { result } = renderHook(() => useShareSnippet());

      await act(async () => {
        await result.current.handleShare('123');
      });

      expect(mockShowToast).toHaveBeenCalledWith('Failed to copy link', 'danger');
    });
  });

  describe('useFilterState', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useFilterState(defaultFilters), {
        wrapper: TestProviders,
      });

      expect(result.current.filters).toEqual(defaultFilters);
    });

    it('should update filters and sync with URL', () => {
      const { result } = renderHook(() => useFilterState(defaultFilters), {
        wrapper: TestProviders,
      });

      act(() => {
        result.current.updateFilters({
          language: 'javascript',
          createdAfter: '2024-01-01',
        });
      });

      expect(result.current.filters.language).toBe('javascript');
      expect(result.current.filters.createdAfter).toBe('2024-01-01');
    });

    it('should reset filters and clear URL params', () => {
      const { result } = renderHook(() => useFilterState(defaultFilters), {
        wrapper: TestProviders,
      });

      // First set some filters
      act(() => {
        result.current.updateFilters({
          language: 'javascript',
          createdAfter: '2024-01-01',
        });
      });

      // Then reset
      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters.language).toBe('');
      expect(result.current.filters.createdAfter).toBe('');
    });

    it('should initialize from URL parameters', () => {
      const { result } = renderHook(() => useFilterState(defaultFilters), {
        wrapper: ({ children }) => (
          <CustomRouterProviders initialEntries={['/snippets?lang=javascript&after=2024-01-01']}>
            {children}
          </CustomRouterProviders>
        ),
      });

      expect(result.current.filters.language).toBe('javascript');
      expect(result.current.filters.createdAfter).toBe('2024-01-01');
    });

    it('should handle search parameters correctly', () => {
      const { result } = renderHook(() => useFilterState(defaultFilters), {
        wrapper: ({ children }) => (
          <CustomRouterProviders initialEntries={['/snippets?title=test&code=console']}>
            {children}
          </CustomRouterProviders>
        ),
      });

      expect(result.current.filters.searchTitle).toBe('test');
      expect(result.current.filters.searchCode).toBe('console');
    });
  });

  describe('usePreviewHeight', () => {
    it('should return default height when no stored value', () => {
      const { result } = renderHook(() => usePreviewHeight());

      expect(result.current.previewHeight).toBe(75);
    });

    it('should return stored height', () => {
      localStorageMock.setItem('previewHeight', '200');

      const { result } = renderHook(() => usePreviewHeight());

      expect(result.current.previewHeight).toBe(200);
    });

    it('should update height and store in localStorage', () => {
      const { result } = renderHook(() => usePreviewHeight());

      act(() => {
        result.current.setPreviewHeight(250);
      });

      expect(result.current.previewHeight).toBe(250);
      expect(localStorageMock.getItem('previewHeight')).toBe('250');
    });
  });
}); 