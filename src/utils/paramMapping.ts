// ============================================================================
// PARAMETER MAPPING UTILITIES
// ============================================================================

// URL parameter mapping (filter names -> URL params)
export const URL_PARAMS = {
  language: 'lang',
  createdAfter: 'after',
  createdBefore: 'before',
  searchTitle: 'title',
  searchCode: 'code',
  page: 'page'
} as const;

// Reverse mapping (URL params -> filter names)
export const URL_TO_FILTER_MAPPING = {
  'lang': 'language',
  'after': 'createdAfter',
  'before': 'createdBefore',
  'title': 'searchTitle',
  'code': 'searchCode',
  'page': 'page'
} as const;

// API parameter mapping (filter names -> API params)
export const API_PARAMS = {
  language: 'language',
  createdAfter: 'created_after',
  createdBefore: 'created_before',
  searchTitle: 'search_title',
  searchCode: 'search_code',
  page: 'page',
  page_size: 'page_size'
} as const;

// Type definitions
export type FilterKey = keyof typeof URL_PARAMS;
export type URLParamKey = keyof typeof URL_TO_FILTER_MAPPING;

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

/**
 * Converts a filter object to URLSearchParams
 * Filters out empty/whitespace-only values
 */
export const filtersToURLParams = (filters: Record<string, unknown>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    const strValue = String(value).trim();
    if (strValue && key in URL_PARAMS) {
      searchParams.set(URL_PARAMS[key as FilterKey], strValue);
    }
  });
  
  return searchParams;
};

/**
 * Converts URLSearchParams to a filter object
 * Only includes parameters that exist in the mapping
 */
export const urlParamsToFilters = (searchParams: URLSearchParams): Record<string, string> => {
  const filters: Record<string, string> = {};
  
  Object.entries(URL_TO_FILTER_MAPPING).forEach(([urlParam, filterKey]) => {
    const value = searchParams.get(urlParam);
    if (value) {
      filters[filterKey] = value;
    }
  });
  
  return filters;
};

/**
 * Converts a filter object to API parameters
 * Filters out empty/whitespace-only values
 */
export const filtersToAPIParams = (filters: Record<string, unknown>): Record<string, string> => {
  const apiParams: Record<string, string> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    const strValue = String(value).trim();
    if (strValue && key in API_PARAMS) {
      apiParams[API_PARAMS[key as FilterKey]] = strValue;
    }
  });
  
  return apiParams;
}; 