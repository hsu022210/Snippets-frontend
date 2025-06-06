import { http, HttpResponse } from 'msw'

// Define your API handlers here
export const handlers = [
  // Example handler for GET request
  http.get('/api/snippets', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Test Snippet',
        content: 'console.log("Hello, World!");',
        language: 'javascript'
      }
    ])
  }),

  // Example handler for POST request
  http.post('/api/snippets', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: Date.now(),
      ...body
    })
  })
] 