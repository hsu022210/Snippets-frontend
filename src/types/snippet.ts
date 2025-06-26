import { Language, Style } from '../utils/validationSchemas';

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: Language;
  linenos?: boolean;
  style?: Style;
  created: string;
  user?: number;
}

export interface SnippetData {
  title: string;
  code: string;
  language: Language;
  linenos?: boolean;
  style?: Style;
}

export interface SnippetListResponse {
  results: Snippet[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface SnippetHeaderProps {
  isEditing: boolean;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  saving: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  setIsEditing: (isEditing: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  title: string;
  isAuthenticated: boolean;
  snippetId: string;
}

export interface SnippetCardProps {
  snippet: Snippet;
}

export interface SnippetLanguageSelectorProps {
  isEditing: boolean;
  editedLanguage: Language;
  setEditedLanguage: (language: Language) => void;
  language: Language;
}

export interface SnippetLanguageFilterProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export interface SnippetFilterValues {
  language: string;
  createdAfter: string;
  createdBefore: string;
  searchTitle: string;
  searchCode: string;
}

export interface SnippetFilterProps {
  language: string;
  createdAfter: string;
  createdBefore: string;
  searchTitle?: string;
  searchCode?: string;
  onFilterChange: (filters: SnippetFilterValues) => void;
}

export interface SnippetFilterSectionProps {
  language: string;
  createdAfter: string;
  createdBefore: string;
  searchTitle?: string;
  searchCode?: string;
  onFilterChange: (filters: SnippetFilterValues) => void;
  onReset: () => void;
  loading?: boolean;
}

export interface FilterOptions {
  language?: string;
  createdAfter?: string;
  createdBefore?: string;
  searchTitle?: string;
  searchCode?: string;
}

export interface SnippetSearchProps {
  searchTitle: string;
  searchCode: string;
  onSearchChange: (field: 'searchTitle' | 'searchCode', value: string) => void;
  loading?: boolean;
}

export interface SnippetListHeaderProps {
  totalCount: number;
  hasActiveFilters: boolean;
}

export interface SnippetGridProps {
  snippets: Snippet[];
} 

export interface SnippetFilters extends FilterOptions {
  page?: number;
  page_size?: number;
}

export interface CreateSnippetRequest {
  title: string;
  code: string;
  language: Language;
  linenos?: boolean;
  style?: Style;
}

export interface UpdateSnippetRequest {
  title?: string;
  code?: string;
  language?: Language;
  linenos?: boolean;
  style?: Style;
} 
