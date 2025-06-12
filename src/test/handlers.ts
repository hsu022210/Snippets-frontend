import { http, HttpResponse } from 'msw'

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface SnippetResponse {
  results: Snippet[];
}

// Mock data
const mockSnippet: Snippet = {
  id: '1',
  title: 'Test Snippet',
  description: 'Test Description',
  language: 'javascript',
  code: 'console.log("test")',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Define your API handlers here
export const handlers = [
  // Snippet handlers
  http.get('/snippets', () => {
    return HttpResponse.json<SnippetResponse>({
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
      description: body.description || '',
      language: body.language || 'plaintext',
      code: body.code || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }),

  http.put('/snippets/:id', async ({ request }) => {
    const body = await request.json() as Partial<Snippet>
    return HttpResponse.json<Snippet>({
      ...mockSnippet,
      ...body,
      updatedAt: new Date().toISOString()
    })
  }),

  http.patch('/snippets/:id', async ({ request }) => {
    const body = await request.json() as Partial<Snippet>
    return HttpResponse.json<Snippet>({
      ...mockSnippet,
      ...body,
      updatedAt: new Date().toISOString()
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