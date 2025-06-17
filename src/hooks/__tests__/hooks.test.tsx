import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useApiRequest } from '../useApiRequest'
import { useSnippetList } from '../useSnippetList'
import { useSnippet, useCreateSnippet } from '../useSnippet'
import { useShareSnippet } from '../useShareSnippet'
import { useFilterState } from '../useFilterState'
import { TestProviders } from '../../test/setup'
import { http, HttpResponse } from 'msw'
import axios from 'axios'
import { localStorageMock } from '../../test/setup'

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
}

describe('Hooks (with MSW)', () => {
  describe('useApiRequest', () => {
    it('should handle successful API request', async () => {
      const { result } = renderHook(() => useApiRequest(), {
        wrapper: TestProviders,
      })
      let response: any
      await act(async () => {
        response = await result.current.makeRequest(() => axios.get('/snippets/1'))
      })
      expect(response?.data.id).toBe('1')
      expect(response?.data.title).toBe('Test Snippet')
    })

    it('should handle API request error', async () => {
      const { result } = renderHook(() => useApiRequest(), {
        wrapper: TestProviders,
      })
      let response
      await act(async () => {
        try {
          response = await result.current.makeRequest(() => axios.get('/snippets/1/error'))
        } catch {
          // Error is expected
        }
      })
      expect(response).toBeUndefined()
    })
  })

  describe('useSnippetList', () => {
    beforeEach(() => {
      // MSW handlers reset automatically
    })

    it('should fetch and return snippets with total count', async () => {
      const { result } = renderHook(() => useSnippetList(), {
        wrapper: TestProviders,
      })
      
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBe('')
      expect(result.current.snippets).toEqual([])
      expect(result.current.totalCount).toBe(0)
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.error).toBe('')
      expect(result.current.snippets.length).toBeGreaterThan(0)
      expect(result.current.totalCount).toBeGreaterThan(0)
      const snippet = result.current.snippets[0] as Snippet
      expect(snippet.id).toBe('1')
    })

    it('should handle fetch error', async () => {
      const { server } = await import('../../test/setup')
      server.use(
        http.get('/snippets', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )
      
      const { result } = renderHook(() => useSnippetList(), {
        wrapper: TestProviders,
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.error).toMatch(/Failed to fetch/)
      expect(result.current.snippets).toEqual([])
      expect(result.current.totalCount).toBe(0)
    })

    it('should filter snippets by language', async () => {
      const { server } = await import('../../test/setup')
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url)
          expect(url.searchParams.get('language')).toBe('javascript')
          return HttpResponse.json({
            results: [
              { id: '1', title: 'JS Snippet', code: 'console.log("test")', language: 'javascript' }
            ]
          })
        })
      )

      const { result } = renderHook(() => useSnippetList({ language: 'javascript' }), {
        wrapper: TestProviders,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('')
      expect(result.current.snippets.length).toBe(1)
      expect(result.current.snippets[0].language).toBe('javascript')
    })

    it('should filter snippets by date range', async () => {
      const { server } = await import('../../test/setup')
      const createdAfter = '2024-01-01'
      const createdBefore = '2024-12-31'
      
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url)
          expect(url.searchParams.get('created_after')).toBe(createdAfter)
          expect(url.searchParams.get('created_before')).toBe(createdBefore)
          return HttpResponse.json({
            results: [
              { id: '1', title: 'Date Filtered Snippet', code: 'test', language: 'python' }
            ]
          })
        })
      )

      const { result } = renderHook(() => useSnippetList({ 
        createdAfter,
        createdBefore
      }), {
        wrapper: TestProviders,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('')
      expect(result.current.snippets.length).toBe(1)
    })

    it('should filter snippets by search terms', async () => {
      const { server } = await import('../../test/setup')
      const searchTitle = 'test'
      const searchCode = 'console.log'
      
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url)
          expect(url.searchParams.get('search_title')).toBe(searchTitle)
          expect(url.searchParams.get('search_code')).toBe(searchCode)
          return HttpResponse.json({
            results: [
              { id: '1', title: 'Test Snippet', code: 'console.log("test")', language: 'javascript' }
            ]
          })
        })
      )

      const { result } = renderHook(() => useSnippetList({ 
        searchTitle,
        searchCode
      }), {
        wrapper: TestProviders,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('')
      expect(result.current.snippets.length).toBe(1)
      expect(result.current.snippets[0].title.toLowerCase()).toContain(searchTitle)
    })

    it('should handle empty results', async () => {
      const { server } = await import('../../test/setup')
      server.use(
        http.get('/snippets', () => {
          return HttpResponse.json({
            results: []
          })
        })
      )

      const { result } = renderHook(() => useSnippetList({ 
        language: 'nonexistent'
      }), {
        wrapper: TestProviders,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('')
      expect(result.current.snippets).toEqual([])
    })

    it('should combine multiple filters', async () => {
      const { server } = await import('../../test/setup')
      const filters = {
        language: 'python',
        searchTitle: 'test',
        createdAfter: '2024-01-01'
      }
      
      server.use(
        http.get('/snippets', ({ request }) => {
          const url = new URL(request.url)
          expect(url.searchParams.get('language')).toBe(filters.language)
          expect(url.searchParams.get('search_title')).toBe(filters.searchTitle)
          expect(url.searchParams.get('created_after')).toBe(filters.createdAfter)
          return HttpResponse.json({
            results: [
              { id: '1', title: 'Test Python Snippet', code: 'print("test")', language: 'python' }
            ]
          })
        })
      )

      const { result } = renderHook(() => useSnippetList(filters), {
        wrapper: TestProviders,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('')
      expect(result.current.snippets.length).toBe(1)
      expect(result.current.snippets[0].language).toBe(filters.language)
      expect(result.current.snippets[0].title.toLowerCase()).toContain(filters.searchTitle)
    })

    it('should update snippets and total count when filters change', async () => {
      const { result, rerender } = renderHook(
        ({ filters }) => useSnippetList(filters),
        {
          wrapper: TestProviders,
          initialProps: { filters: {} },
        }
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const initialCount = result.current.totalCount

      // Update filters
      rerender({ filters: { language: 'javascript' } })

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // The total count should remain the same, but filtered snippets might be different
      expect(result.current.totalCount).toBe(initialCount)
      // The snippets array might be different due to filtering
      expect(Array.isArray(result.current.snippets)).toBe(true)
    })
  })

  describe('useSnippet', () => {
    beforeEach(() => {
      // MSW handlers reset automatically
    })

    it('should fetch and return a snippet', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      })
      
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBe('')
      expect(result.current.snippet).toBeNull()
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.error).toBe('')
      expect(result.current.snippet).not.toBeNull()
      const fetchedSnippet = result.current.snippet as unknown as Snippet
      expect(fetchedSnippet.id).toBe('1')
    })

    it('should handle fetch error', async () => {
      const { server } = await import('../../test/setup')
      server.use(
        http.get('/snippets/1', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )
      
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.error).toMatch(/Failed to fetch/)
      expect(result.current.snippet).toBeNull()
    })

    it('should handle save operation', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(() => {
        result.current.setIsEditing(true)
        result.current.setEditedTitle('Updated Title')
      })
      
      await waitFor(async () => {
        await result.current.handleSave()
        expect(result.current.snippet).not.toBeNull()
        const updatedSnippet = result.current.snippet as unknown as Snippet
        expect(updatedSnippet.title).toBe('Updated Title')
        expect(result.current.isEditing).toBe(false)
      })
    })

    it('should handle delete operation', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.handleDelete()
      })
      
      // No error means delete succeeded
    })

    it('should handle cancel operation', async () => {
      const { result } = renderHook(() => useSnippet(1), {
        wrapper: TestProviders,
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        result.current.setIsEditing(true)
        result.current.setEditedTitle('New Title')
        result.current.handleCancel()
      })
      
      expect(result.current.isEditing).toBe(false)
      expect(result.current.snippet).not.toBeNull()
      const cancelledSnippet = result.current.snippet as unknown as Snippet
      expect(result.current.editedTitle).toBe(cancelledSnippet.title)
      expect(result.current.saveError).toBe('')
    })
  })

  describe('useCreateSnippet', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
      });
    })

    it('should create a new snippet successfully', async () => {
      const { result } = renderHook(() => useCreateSnippet(), {
        wrapper: TestProviders,
      })

      const newSnippet = {
        title: 'New Test Snippet',
        code: 'console.log("test")',
        language: 'javascript'
      }

      await act(async () => {
        await result.current.createSnippet(newSnippet)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('')
    })

    it('should handle creation error', async () => {
      const { server } = await import('../../test/setup')
      server.use(
        http.post('/snippets/', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const { result } = renderHook(() => useCreateSnippet(), {
        wrapper: TestProviders,
      })

      const newSnippet = {
        title: 'New Test Snippet',
        code: 'console.log("test")',
        language: 'javascript'
      }

      await act(async () => {
        try {
          await result.current.createSnippet(newSnippet)
        } catch {
          // Error is expected
        }
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toMatch(/Failed to create/)
      })
    })

    it('should handle authentication error', async () => {
      const { server } = await import('../../test/setup')
      server.use(
        http.post('/snippets/', () => {
          return new HttpResponse(null, { status: 401 })
        })
      )

      const { result } = renderHook(() => useCreateSnippet(), {
        wrapper: TestProviders,
      })

      const newSnippet = {
        title: 'New Test Snippet',
        code: 'console.log("test")',
        language: 'javascript'
      }

      await act(async () => {
        try {
          await result.current.createSnippet(newSnippet)
        } catch {
          // Error is expected
        }
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toMatch(/Failed to create snippet/)
      })
    })
  })

  describe('useShareSnippet', () => {
    const mockClipboard = {
      writeText: vi.fn(),
    };

    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: mockClipboard,
      });
      vi.clearAllMocks();
      // Mock timers
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should copy snippet URL to clipboard and show success toast', async () => {
      const { result } = renderHook(() => useShareSnippet(), {
        wrapper: TestProviders,
      });

      const snippetId = '123';
      const expectedUrl = `${window.location.origin}/snippets/${snippetId}`;

      await act(async () => {
        await result.current.handleShare(snippetId);
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(expectedUrl);
      expect(result.current.shareSnippetTooltip).toBe('Link copied!');

      // Fast-forward timers
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.shareSnippetTooltip).toBe('Share snippet');
    });

    it('should handle clipboard error and show error toast', async () => {
      const { result } = renderHook(() => useShareSnippet(), {
        wrapper: TestProviders,
      });

      // Mock clipboard error
      mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));

      await act(async () => {
        await result.current.handleShare('123');
      });

      expect(result.current.shareSnippetTooltip).toBe('Failed to copy link');
    });

    it('should initialize with default tooltip text', () => {
      const { result } = renderHook(() => useShareSnippet(), {
        wrapper: TestProviders,
      });

      expect(result.current.shareSnippetTooltip).toBe('Share snippet');
    });
  });

  describe('useFilterState', () => {
    const initialFilters = {
      language: '',
      createdAfter: '',
      createdBefore: '',
      searchTitle: '',
      searchCode: '',
    };

    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should initialize with default filters when no stored filters exist', () => {
      const { result } = renderHook(() => useFilterState(initialFilters), {
        wrapper: TestProviders,
      });

      expect(result.current.filters).toEqual(initialFilters);
    });

    it('should initialize with stored filters from localStorage', () => {
      const storedFilters = {
        language: 'javascript',
        createdAfter: '2024-01-01',
        createdBefore: '',
        searchTitle: 'test',
        searchCode: '',
      };

      localStorage.setItem('snippet_filters', JSON.stringify(storedFilters));

      const { result } = renderHook(() => useFilterState(initialFilters), {
        wrapper: TestProviders,
      });

      expect(result.current.filters).toEqual(storedFilters);
    });

    it('should update filters and persist to localStorage', () => {
      const { result } = renderHook(() => useFilterState(initialFilters), {
        wrapper: TestProviders,
      });

      const newFilters = {
        language: 'python',
        createdAfter: '2024-01-01',
      };

      act(() => {
        result.current.updateFilters(newFilters);
      });

      expect(result.current.filters).toEqual({
        ...initialFilters,
        ...newFilters,
      });

      const storedFilters = JSON.parse(localStorage.getItem('snippet_filters') || '{}');
      expect(storedFilters).toEqual({
        ...initialFilters,
        ...newFilters,
      });
    });

    it('should reset filters and clear localStorage', () => {
      const storedFilters = {
        language: 'javascript',
        createdAfter: '2024-01-01',
        createdBefore: '',
        searchTitle: 'test',
        searchCode: '',
      };

      localStorage.setItem('snippet_filters', JSON.stringify(storedFilters));

      const { result } = renderHook(() => useFilterState(initialFilters), {
        wrapper: TestProviders,
      });

      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters).toEqual(initialFilters);
      expect(localStorage.getItem('snippet_filters')).toBeNull();
    });

    it('should clear localStorage when all filters are empty', () => {
      const { result } = renderHook(() => useFilterState(initialFilters), {
        wrapper: TestProviders,
      });

      // First set some filters
      act(() => {
        result.current.updateFilters({
          language: 'javascript',
          searchTitle: 'test'
        });
      });

      // Then clear all filters
      act(() => {
        result.current.updateFilters({
          language: '',
          searchTitle: '',
          searchCode: '',
          createdAfter: '',
          createdBefore: ''
        });
      });

      expect(result.current.filters).toEqual(initialFilters);
      expect(localStorage.getItem('snippet_filters')).toBeNull();
    });

    it('should handle partial filter updates', () => {
      const { result } = renderHook(() => useFilterState(initialFilters), {
        wrapper: TestProviders,
      });

      act(() => {
        result.current.updateFilters({ language: 'javascript' });
      });

      expect(result.current.filters).toEqual({
        ...initialFilters,
        language: 'javascript',
      });

      act(() => {
        result.current.updateFilters({ searchTitle: 'test' });
      });

      expect(result.current.filters).toEqual({
        ...initialFilters,
        language: 'javascript',
        searchTitle: 'test',
      });
    });
  });
}) 