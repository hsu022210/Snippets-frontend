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
  http.get('/api/snippets', () => {
    return HttpResponse.json([mockSnippet])
  }),

  http.get('/api/snippets/:id', () => {
    return HttpResponse.json(mockSnippet)
  }),

  http.post('/api/snippets', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }),

  http.put('/api/snippets/:id', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      ...mockSnippet,
      ...body,
      updatedAt: new Date().toISOString()
    })
  }),

  http.patch('/api/snippets/:id', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      ...mockSnippet,
      ...body,
      updatedAt: new Date().toISOString()
    })
  }),

  http.delete('/api/snippets/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Auth handlers
  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Error handlers for testing error states
  http.get('/api/snippets/:id/error', () => {
    return new HttpResponse(null, { status: 500 })
  })
] 