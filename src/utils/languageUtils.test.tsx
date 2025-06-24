// Mock declarations must be at the top level, before imports
vi.mock('@codemirror/lang-javascript', () => ({ javascript: vi.fn(() => 'js-ext') }));
vi.mock('@codemirror/lang-python', () => ({ python: vi.fn(() => 'py-ext') }));
vi.mock('@codemirror/lang-java', () => ({ java: vi.fn(() => 'java-ext') }));
vi.mock('@codemirror/lang-cpp', () => ({ cpp: vi.fn(() => 'cpp-ext') }));
vi.mock('@codemirror/lang-css', () => ({ css: vi.fn(() => 'css-ext') }));
vi.mock('@codemirror/lang-html', () => ({ html: vi.fn(() => 'html-ext') }));
vi.mock('@codemirror/lang-sql', () => ({ sql: vi.fn(() => 'sql-ext') }));
vi.mock('@codemirror/lang-json', () => ({ json: vi.fn(() => 'json-ext') }));
vi.mock('@codemirror/lang-markdown', () => ({ markdown: vi.fn(() => 'md-ext') }));
vi.mock('@codemirror/lang-rust', () => ({ rust: vi.fn(() => 'rust-ext') }));
vi.mock('@codemirror/lang-php', () => ({ php: vi.fn(() => 'php-ext') }));
vi.mock('@codemirror/lang-xml', () => ({ xml: vi.fn(() => 'xml-ext') }));
vi.mock('@codemirror/lang-yaml', () => ({ yaml: vi.fn(() => 'yaml-ext') }));

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import {
  SUPPORTED_LANGUAGES,
  getLanguageExtension,
  getLanguageDisplayName,
  LanguageOptions,
  processCode,
} from './languageUtils'

// Get the mocked functions
const { javascript } = await import('@codemirror/lang-javascript');

describe('Language Constants', () => {
  it('SUPPORTED_LANGUAGES should include all supported languages with correct keys', () => {
    expect(SUPPORTED_LANGUAGES).toEqual({
      JAVASCRIPT: 'javascript',
      PYTHON: 'python',
      JAVA: 'java',
      CPP: 'cpp',
      C: 'c',
      HTML: 'html',
      CSS: 'css',
      SQL: 'sql',
      JSON: 'json',
      MARKDOWN: 'markdown',
      TYPESCRIPT: 'typescript',
      RUST: 'rust',
      PHP: 'php',
      XML: 'xml',
      YAML: 'yaml'
    });
  });
});

describe('getLanguageExtension', () => {
  it('returns the correct extension for each language', () => {
    expect(getLanguageExtension('javascript')[0]).toBe('js-ext');
    expect(getLanguageExtension('typescript')[0]).toBe('js-ext');
    expect(getLanguageExtension('python')[0]).toBe('py-ext');
    expect(getLanguageExtension('java')[0]).toBe('java-ext');
    expect(getLanguageExtension('cpp')[0]).toBe('cpp-ext');
    expect(getLanguageExtension('c')[0]).toBe('cpp-ext');
    expect(getLanguageExtension('css')[0]).toBe('css-ext');
    expect(getLanguageExtension('html')[0]).toBe('html-ext');
    expect(getLanguageExtension('sql')[0]).toBe('sql-ext');
    expect(getLanguageExtension('json')[0]).toBe('json-ext');
    expect(getLanguageExtension('markdown')[0]).toBe('md-ext');
    expect(getLanguageExtension('rust')[0]).toBe('rust-ext');
    expect(getLanguageExtension('php')[0]).toBe('php-ext');
    expect(getLanguageExtension('xml')[0]).toBe('xml-ext');
    expect(getLanguageExtension('yaml')[0]).toBe('yaml-ext');
    // Unknown language returns []
    expect(getLanguageExtension('unknown')).toEqual([]);
    // No language returns []
    expect(getLanguageExtension('')).toEqual([]);
    expect(getLanguageExtension(null as unknown as string)).toEqual([]);
  });

  it('handles case-insensitive language names', () => {
    // Test with lowercase since the implementation expects lowercase
    expect(getLanguageExtension('Javascript')[0]).toBe('js-ext');
    expect(getLanguageExtension('PYTHON')[0]).toBe('py-ext');
    expect(getLanguageExtension('TyPeScriPt')[0]).toBe('js-ext');
  });

  it('handles error in language extension loading', () => {
    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Mock a language extension to throw an error
    const mockError = new Error('Failed to load extension');
    vi.mocked(javascript).mockImplementationOnce(() => {
      throw mockError;
    });

    expect(getLanguageExtension('javascript')).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      'Error loading language extension for javascript:',
      mockError
    );

    // Restore console.error
    console.error = originalConsoleError;
  });
});

describe('getLanguageDisplayName', () => {
  it('returns correct display names for supported languages', () => {
    expect(getLanguageDisplayName('javascript')).toBe('JavaScript');
    expect(getLanguageDisplayName('python')).toBe('Python');
    expect(getLanguageDisplayName('typescript')).toBe('TypeScript');
    expect(getLanguageDisplayName('cpp')).toBe('C++');
    expect(getLanguageDisplayName('c')).toBe('C');
  });

  it('returns "None" for unsupported languages', () => {
    expect(getLanguageDisplayName('unknown')).toBe('None');
    expect(getLanguageDisplayName('')).toBe('None');
    expect(getLanguageDisplayName(null as unknown as string)).toBe('None');
  });
});

describe('LanguageOptions', () => {
  it('renders all supported languages as options', () => {
    const { container } = render(<LanguageOptions />);
    const options = container.querySelectorAll('option');
    
    // Check that we have the correct number of options
    expect(options.length).toBe(Object.keys(SUPPORTED_LANGUAGES).length);
    
    // Check that each option has the correct value and display name
    Object.values(SUPPORTED_LANGUAGES).forEach((lang) => {
      const option = container.querySelector(`option[value="${lang}"]`);
      expect(option).toBeTruthy();
      expect(option?.textContent).toBe(getLanguageDisplayName(lang));
    });
  });

  it('renders options with correct key prop', () => {
    const { container } = render(<LanguageOptions />);
    const options = container.querySelectorAll('option');
    
    // Check that each option has a unique value (which is used as the key)
    const values = new Set();
    options.forEach(option => {
      const value = option.getAttribute('value');
      expect(value).toBeTruthy();
      expect(values.has(value)).toBe(false);
      values.add(value);
    });
  });
});

describe('processCode', () => {
  it('returns empty string for falsy input', () => {
    expect(processCode('')).toBe('');
    expect(processCode(null)).toBe('');
    expect(processCode(undefined)).toBe('');
  });

  it('returns string as-is if not JSON-like', () => {
    expect(processCode('console.log(123);')).toBe('console.log(123);');
    expect(processCode('   some code here   ')).toBe('   some code here   ');
  });

  it('parses JSON string and pretty-prints if possible', () => {
    expect(processCode('{"a":1}')).toBe(`{
  "a": 1
}`);
    expect(processCode('[1,2,3]')).toBe(`[
  1,
  2,
  3
]`);
    expect(processCode('"just a string"')).toBe('"just a string"');
  });

  it('returns original string if JSON parsing fails', () => {
    expect(processCode('{not valid json')).toBe('{not valid json');
  });

  it('stringifies objects', () => {
    expect(processCode({ a: 1, b: 2 })).toBe(`{
  "a": 1,
  "b": 2
}`);
    expect(processCode([1, 2, 3])).toBe(`[
  1,
  2,
  3
]`);
  });

  it('handles numbers and booleans', () => {
    expect(processCode(123)).toBe('123');
    expect(processCode(true)).toBe('true');
  });

  it('handles complex nested objects', () => {
    const complexObject = {
      a: {
        b: [1, 2, { c: 3 }],
        d: { e: 'test' }
      }
    };
    expect(processCode(complexObject)).toBe(`{
  "a": {
    "b": [
      1,
      2,
      {
        "c": 3
      }
    ],
    "d": {
      "e": "test"
    }
  }
}`);
  });

  it('handles special characters in strings', () => {
    expect(processCode('{"special": "\\n\\t\\r"}')).toBe(`{
  "special": "\\n\\t\\r"
}`);
  });

  it('handles error in code processing', () => {
    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Create an object that will cause an error when stringified
    const circularObject: Record<string, unknown> = {};
    (circularObject as Record<string, unknown>).self = circularObject;

    expect(processCode(circularObject)).toBe('// Error: Could not process code content');
    expect(console.error).toHaveBeenCalledWith(
      'Error processing code:',
      expect.any(Error)
    );

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('handles whitespace-only strings', () => {
    expect(processCode('   ')).toBe('   ');
    expect(processCode('\n\t\r')).toBe('\n\t\r');
  });

  it('handles malformed JSON strings', () => {
    expect(processCode('{"unclosed": true')).toBe('{"unclosed": true');
    expect(processCode('[1,2,3')).toBe('[1,2,3');
    expect(processCode('{"missing": value}')).toBe('{"missing": value}');
  });
}); 