import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { sql } from '@codemirror/lang-sql'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import { rust } from '@codemirror/lang-rust'
import { php } from '@codemirror/lang-php'
import { xml } from '@codemirror/lang-xml'
import { yaml } from '@codemirror/lang-yaml'
import { Extension } from '@codemirror/state'

export const LANGUAGE_OPTIONS = [
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
] as const;

export type LanguageOption = typeof LANGUAGE_OPTIONS[number];

export const getLanguageExtension = (selectedLanguage: string): Extension[] => {
  if (!selectedLanguage) return [];
  
  try {
    const languageMap: Record<string, Extension> = {
      'javascript': javascript({ jsx: true }),
      'python': python(),
      'html': html(),
      'css': css(),
      'java': java(),
      'cpp': cpp(),
      'c': cpp(),
      'sql': sql(),
      'json': json(),
      'markdown': markdown(),
      'typescript': javascript({ typescript: true }),
      'rust': rust(),
      'php': php(),
      'xml': xml(),
      'yaml': yaml()
    };
    
    return languageMap[selectedLanguage.toLowerCase()] ? [languageMap[selectedLanguage.toLowerCase()]] : [];
  } catch (error) {
    console.error('Error loading language extension:', error);
    return [];
  }
};

export const processCode = (codeToProcess: unknown): string => {
  if (!codeToProcess) return '';
  
  try {
    // If code is already a string and doesn't look like JSON, return it directly
    if (typeof codeToProcess === 'string' && 
        !codeToProcess.trim().startsWith('{') && 
        !codeToProcess.trim().startsWith('[')) {
      return codeToProcess;
    }
    
    // Handle if code is stored as a JSON string
    if (typeof codeToProcess === 'string') {
      try {
        const parsed = JSON.parse(codeToProcess);
        return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
      } catch {
        // If JSON parsing fails, return the original string
        return codeToProcess;
      }
    }
    
    // Handle if code is already an object
    if (typeof codeToProcess === 'object') {
      return JSON.stringify(codeToProcess, null, 2);
    }

    return String(codeToProcess);
  } catch (error) {
    console.error('Error processing code:', error);
    return '// Error: Could not process code content';
  }
}; 