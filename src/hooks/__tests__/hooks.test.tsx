import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useApiRequest } from '../useApiRequest'
import { useSnippetList } from '../useSnippetList'
import { useSnippet } from '../useSnippet'
import { TestProviders } from '../../test/setup'
import { http, HttpResponse } from 'msw'

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
      let response
      await act(async () => {
        response = await result.current.makeRequest(() => fetch('/snippets/1'))
        response = await response.json()
      })
      expect(response.id).toBe('1')
      expect(response.title).toBe('Test Snippet')
    })

    it('should handle API request error', async () => {
      const { result } = renderHook(() => useApiRequest(), {
        wrapper: TestProviders,
      })
      let response
      await act(async () => {
        response = await result.current.makeRequest(() => fetch('/snippets/1/error'))
      })
      expect(response.status).toBe(500)
    })
  })

  describe('useSnippetList', () => {
    beforeEach(() => {
      // MSW handlers reset automatically
    })

    it('should fetch and return snippets', async () => {
      const { result } = renderHook(() => useSnippetList(), {
        wrapper: TestProviders,
      })
      
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBe('')
      expect(result.current.snippets).toEqual([])
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.error).toBe('')
      expect(result.current.snippets.length).toBeGreaterThan(0)
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
    })
  })

  describe('useSnippet', () => {
    beforeEach(() => {
      // MSW handlers reset automatically
    })

    it('should fetch and return a snippet', async () => {
      const { result } = renderHook(() => useSnippet('1'), {
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
      
      const { result } = renderHook(() => useSnippet('1'), {
        wrapper: TestProviders,
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.error).toMatch(/Failed to fetch/)
      expect(result.current.snippet).toBeNull()
    })

    it('should handle save operation', async () => {
      const { result } = renderHook(() => useSnippet('1'), {
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
      const { result } = renderHook(() => useSnippet('1'), {
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
      const { result } = renderHook(() => useSnippet('1'), {
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
}) 