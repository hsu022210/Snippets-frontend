import { apiClient } from './api';
import { Snippet, SnippetListResponse, SnippetFilters, CreateSnippetRequest, UpdateSnippetRequest } from '../types';
import { 
  snippetSchema, 
  snippetListResponseSchema,
  Snippet as ZodSnippet,
  SnippetListResponse as ZodSnippetListResponse
} from '../utils/validationSchemas';

export class SnippetService {
  // Get snippets with optional filters
  async getSnippets(filters?: SnippetFilters): Promise<SnippetListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.language) {
      params.append('language', filters.language);
    }
    if (filters?.createdAfter) {
      params.append('created_after', filters.createdAfter);
    }
    if (filters?.createdBefore) {
      params.append('created_before', filters.createdBefore);
    }
    if (filters?.searchTitle) {
      params.append('search_title', filters.searchTitle);
    }
    if (filters?.searchCode) {
      params.append('search_code', filters.searchCode);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    if (filters?.page_size) {
      params.append('page_size', filters.page_size.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/snippets/?${queryString}` : '/snippets/';
    
    return apiClient.get<ZodSnippetListResponse>(url, undefined, snippetListResponseSchema);
  }

  // Get a single snippet by ID
  async getSnippet(id: number): Promise<Snippet> {
    return apiClient.get<ZodSnippet>(`/snippets/${id}/`, undefined, snippetSchema);
  }

  // Create a new snippet
  async createSnippet(snippetData: CreateSnippetRequest): Promise<Snippet> {
    return apiClient.post<ZodSnippet>('/snippets/', snippetData, undefined, snippetSchema);
  }

  // Update an existing snippet
  async updateSnippet(id: number, snippetData: UpdateSnippetRequest): Promise<Snippet> {
    return apiClient.patch<ZodSnippet>(`/snippets/${id}/`, snippetData, undefined, snippetSchema);
  }

  // Delete a snippet
  async deleteSnippet(id: number): Promise<void> {
    return apiClient.delete(`/snippets/${id}/`);
  }
}

// Export singleton instance
export const snippetService = new SnippetService(); 