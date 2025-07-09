import { describe, it, expect } from 'vitest';
import { 
  URL_PARAMS, 
  URL_TO_FILTER_MAPPING, 
  API_PARAMS,
  filtersToURLParams,
  urlParamsToFilters,
  filtersToAPIParams
} from './paramMapping';

describe('Parameter Mapping Utilities', () => {
  describe('URL_PARAMS', () => {
    it('should have correct URL parameter mappings', () => {
      expect(URL_PARAMS).toEqual({
        language: 'lang',
        createdAfter: 'after',
        createdBefore: 'before',
        searchTitle: 'title',
        searchCode: 'code',
        page: 'page'
      });
    });
  });

  describe('URL_TO_FILTER_MAPPING', () => {
    it('should have correct reverse mappings', () => {
      expect(URL_TO_FILTER_MAPPING).toEqual({
        'lang': 'language',
        'after': 'createdAfter',
        'before': 'createdBefore',
        'title': 'searchTitle',
        'code': 'searchCode',
        'page': 'page'
      });
    });
  });

  describe('API_PARAMS', () => {
    it('should have correct API parameter mappings', () => {
      expect(API_PARAMS).toEqual({
        language: 'language',
        createdAfter: 'created_after',
        createdBefore: 'created_before',
        searchTitle: 'search_title',
        searchCode: 'search_code',
        page: 'page',
        page_size: 'page_size'
      });
    });
  });



  describe('filtersToURLParams', () => {
    it('should convert filters to URL search params', () => {
      const filters = {
        language: 'javascript',
        searchTitle: 'test',
        createdAfter: '2023-01-01',
        page: '2'
      };

      const result = filtersToURLParams(filters);
      
      expect(result.get('lang')).toBe('javascript');
      expect(result.get('title')).toBe('test');
      expect(result.get('after')).toBe('2023-01-01');
      expect(result.get('page')).toBe('2');
    });

    it('should skip empty values', () => {
      const filters = {
        language: '',
        searchTitle: 'test',
        createdAfter: '   ',
        searchCode: 'code'
      };

      const result = filtersToURLParams(filters);
      
      expect(result.get('lang')).toBeNull();
      expect(result.get('title')).toBe('test');
      expect(result.get('after')).toBeNull();
      expect(result.get('code')).toBe('code');
    });

    it('should handle unknown filter keys gracefully', () => {
      const filters = {
        language: 'javascript',
        unknownKey: 'value'
      };

      const result = filtersToURLParams(filters);
      
      expect(result.get('lang')).toBe('javascript');
      expect(result.get('unknownKey')).toBeNull();
    });
  });

  describe('urlParamsToFilters', () => {
    it('should convert URL search params to filters', () => {
      const searchParams = new URLSearchParams();
      searchParams.set('lang', 'javascript');
      searchParams.set('title', 'test');
      searchParams.set('after', '2023-01-01');
      searchParams.set('page', '2');

      const result = urlParamsToFilters(searchParams);
      
      expect(result).toEqual({
        language: 'javascript',
        searchTitle: 'test',
        createdAfter: '2023-01-01',
        page: '2'
      });
    });

    it('should handle missing parameters', () => {
      const searchParams = new URLSearchParams();
      searchParams.set('lang', 'javascript');

      const result = urlParamsToFilters(searchParams);
      
      expect(result).toEqual({
        language: 'javascript'
      });
    });

    it('should ignore unknown URL parameters', () => {
      const searchParams = new URLSearchParams();
      searchParams.set('lang', 'javascript');
      searchParams.set('unknown', 'value');

      const result = urlParamsToFilters(searchParams);
      
      expect(result).toEqual({
        language: 'javascript'
      });
    });
  });

  describe('filtersToAPIParams', () => {
    it('should convert filters to API parameters', () => {
      const filters = {
        language: 'javascript',
        searchTitle: 'test',
        createdAfter: '2023-01-01',
        searchCode: 'code'
      };

      const result = filtersToAPIParams(filters);
      
      expect(result).toEqual({
        language: 'javascript',
        search_title: 'test',
        created_after: '2023-01-01',
        search_code: 'code'
      });
    });

    it('should skip empty values', () => {
      const filters = {
        language: '',
        searchTitle: 'test',
        createdAfter: '   ',
        searchCode: 'code'
      };

      const result = filtersToAPIParams(filters);
      
      expect(result).toEqual({
        search_title: 'test',
        search_code: 'code'
      });
    });

    it('should include page and page_size parameters in API mapping', () => {
      const filters = {
        language: 'javascript',
        page: '2',
        page_size: '10'
      };

      const result = filtersToAPIParams(filters);
      
      expect(result).toEqual({
        language: 'javascript',
        page: '2',
        page_size: '10'
      });
    });

    it('should handle unknown filter keys gracefully', () => {
      const filters = {
        language: 'javascript',
        unknownKey: 'value'
      };

      const result = filtersToAPIParams(filters);
      
      expect(result).toEqual({
        language: 'javascript'
      });
    });
  });
}); 