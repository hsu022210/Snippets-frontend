import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { sql } from '@codemirror/lang-sql';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';

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
  'typescript'
];

export const getLanguageExtension = (selectedLanguage) => {
  if (!selectedLanguage) return [];
  
  try {
    const languageMap = {
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
    };
    
    return languageMap[selectedLanguage.toLowerCase()] || [];
  } catch (error) {
    console.error('Error loading language extension:', error);
    return [];
  }
};

export const processCode = (codeToProcess) => {
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