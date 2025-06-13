import { http, HttpResponse } from 'msw'
import { Snippet, SnippetListResponse } from '../types/interfaces'

// Mock data
const mockSnippet: Snippet = {
  id: '1',
  title: 'Test Snippet',
  language: 'javascript',
  code: 'console.log("test")',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Define your API handlers here
export const handlers = [
  // Snippet handlers
  http.get('/snippets', () => {
    return HttpResponse.json<SnippetListResponse>({
      results: [mockSnippet]
    })
  }),

  http.get('/snippets/:id', () => {
    return HttpResponse.json<Snippet>(mockSnippet)
  }),

  http.post('/snippets', async ({ request }) => {
    const body = await request.json() as Partial<Snippet>
    return HttpResponse.json<Snippet>({
      id: Date.now().toString(),
      title: body.title || 'Untitled Snippet',
      language: body.language || 'plaintext',
      code: body.code || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }),

  http.put('/snippets/:id', async ({ request }) => {
    const body = await request.json() as Partial<Snippet>
    return HttpResponse.json<Snippet>({
      ...mockSnippet,
      ...body,
      updated_at: new Date().toISOString()
    })
  }),

  http.patch('/snippets/:id', async ({ request }) => {
    const body = await request.json() as Partial<Snippet>
    return HttpResponse.json<Snippet>({
      ...mockSnippet,
      ...body,
      updated_at: new Date().toISOString()
    })
  }),

  http.delete('/snippets/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Auth handlers
  http.post('/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Error handlers for testing error states
  http.get('/snippets/:id/error', () => {
    return new HttpResponse(null, { status: 500 })
  })
] 