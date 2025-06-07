import { http, HttpResponse } from 'msw'

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

// Define your API handlers here
export const handlers = [
  // Snippet handlers
  http.get('/snippets', () => {
    return HttpResponse.json({
      results: [mockSnippet]
    })
  }),

  http.get('/snippets/:id', () => {
    return HttpResponse.json(mockSnippet)
  }),

  http.post('/snippets', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }),

  http.put('/snippets/:id', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      ...mockSnippet,
      ...body,
      updatedAt: new Date().toISOString()
    })
  }),

  http.patch('/snippets/:id', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
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