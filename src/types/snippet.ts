import { 
  Snippet, 
  SnippetData, 
  SnippetUpdateData, 
  SnippetFilterData, 
  SnippetListResponse,
  Language, 
  Style,
  SnippetFilterValues,
  FilterOptions,
  SnippetFilters,
  CreateSnippetRequest,
  UpdateSnippetRequest
} from '../utils/validationSchemas';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

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
  filters?: SnippetFilterValues;
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
  filters?: SnippetFilterValues;
  currentPage?: number;
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

// ============================================================================
// RE-EXPORTS FROM VALIDATION SCHEMAS
// ============================================================================

export type {
  Snippet,
  SnippetData,
  SnippetUpdateData,
  SnippetFilterData,
  SnippetListResponse,
  Language,
  Style,
  SnippetFilterValues,
  FilterOptions,
  SnippetFilters,
  CreateSnippetRequest,
  UpdateSnippetRequest
}; 
