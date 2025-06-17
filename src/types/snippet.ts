export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  created: string;
  user?: number;
}

export interface SnippetData {
  title: string;
  code: string;
  language: string;
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
  editedLanguage: string;
  setEditedLanguage: (language: string) => void;
  language: string;
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