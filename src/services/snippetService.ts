import { apiClient } from './api';
import { Snippet, SnippetListResponse, SnippetFilters, CreateSnippetRequest, UpdateSnippetRequest } from '../types';
import { 
  snippetSchema, 
  snippetListResponseSchema,
  Snippet as ZodSnippet,
  SnippetListResponse as ZodSnippetListResponse
} from '../utils/validationSchemas';
import { filtersToAPIParams } from '../utils/paramMapping';

export class SnippetService {
  // Get snippets with optional filters
  async getSnippets(filters?: SnippetFilters): Promise<SnippetListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      // Convert filter names to API parameter names
      const apiParams = filtersToAPIParams(filters as Record<string, string>);
      
      // Add API parameters to URL search params
      Object.entries(apiParams).forEach(([key, value]) => {
        params.append(key, value);
      });
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