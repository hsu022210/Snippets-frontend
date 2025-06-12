import { describe, it, expect, vi } from 'vitest';
import {
  LANGUAGE_OPTIONS,
  getLanguageExtension,
  processCode
} from './languageUtils';

// Mock the language extension functions to avoid requiring CodeMirror internals
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

describe('LANGUAGE_OPTIONS', () => {
  it('should include all supported languages', () => {
    expect(LANGUAGE_OPTIONS).toEqual([
      'javascript',
      'python',
      'java',
      'cpp',
      'c',
      'html',
      'css',
      'sql',
      'json',
      'markdown',
      'typescript',
      'rust',
      'php',
      'xml',
      'yaml'
    ]);
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
}); 