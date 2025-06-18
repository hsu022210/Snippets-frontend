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
import { Language } from '@/types/snippet'

// Define supported languages as a const object for better type safety
export const SUPPORTED_LANGUAGES = {
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
} as const;

// Create a type from the values of SUPPORTED_LANGUAGES
// type Language = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

// Define the language configuration interface
interface LanguageConfig {
  extension: () => Extension;
  displayName: string;
}

// Map of language configurations
const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  [SUPPORTED_LANGUAGES.JAVASCRIPT]: {
    extension: () => javascript({ jsx: true }),
    displayName: 'JavaScript'
  },
  [SUPPORTED_LANGUAGES.PYTHON]: {
    extension: () => python(),
    displayName: 'Python'
  },
  [SUPPORTED_LANGUAGES.HTML]: {
    extension: () => html(),
    displayName: 'HTML'
  },
  [SUPPORTED_LANGUAGES.CSS]: {
    extension: () => css(),
    displayName: 'CSS'
  },
  [SUPPORTED_LANGUAGES.JAVA]: {
    extension: () => java(),
    displayName: 'Java'
  },
  [SUPPORTED_LANGUAGES.CPP]: {
    extension: () => cpp(),
    displayName: 'C++'
  },
  [SUPPORTED_LANGUAGES.C]: {
    extension: () => cpp(),
    displayName: 'C'
  },
  [SUPPORTED_LANGUAGES.SQL]: {
    extension: () => sql(),
    displayName: 'SQL'
  },
  [SUPPORTED_LANGUAGES.JSON]: {
    extension: () => json(),
    displayName: 'JSON'
  },
  [SUPPORTED_LANGUAGES.MARKDOWN]: {
    extension: () => markdown(),
    displayName: 'Markdown'
  },
  [SUPPORTED_LANGUAGES.TYPESCRIPT]: {
    extension: () => javascript({ typescript: true }),
    displayName: 'TypeScript'
  },
  [SUPPORTED_LANGUAGES.RUST]: {
    extension: () => rust(),
    displayName: 'Rust'
  },
  [SUPPORTED_LANGUAGES.PHP]: {
    extension: () => php(),
    displayName: 'PHP'
  },
  [SUPPORTED_LANGUAGES.XML]: {
    extension: () => xml(),
    displayName: 'XML'
  },
  [SUPPORTED_LANGUAGES.YAML]: {
    extension: () => yaml(),
    displayName: 'YAML'
  }
};

/**
 * Gets the CodeMirror extension for a given language
 * @param language - The language to get the extension for
 * @returns Array of CodeMirror extensions for the selected language
 */
export const getLanguageExtension = (language: string): Extension[] => {
  if (!language) return [];
  language = language.toLowerCase() as Language;
  
  try {
    const config = LANGUAGE_CONFIGS[language];
    return config ? [config.extension()] : [];
  } catch (error) {
    console.error(`Error loading language extension for ${language}:`, error);
    return [];
  }
};

export const getLanguageDisplayName = (language: string): string => {
  if (!language) return 'None';
  language = language.toLowerCase() as Language;
  return LANGUAGE_CONFIGS[language]?.displayName || 'None';
};

export const LanguageOptions = () => {
  return (
    Object.values(SUPPORTED_LANGUAGES).map((lang) => (
      <option key={lang} value={lang}>
        {getLanguageDisplayName(lang)}
      </option>
    ))
  )
}

/**
 * Processes code content into a string format
 * @param codeToProcess - The code content to process
 * @returns Processed code as a string
 */
export const processCode = (codeToProcess: unknown): string => {
  if (!codeToProcess) return '';
  
  try {
    // Handle string input
    if (typeof codeToProcess === 'string') {
      // If it's a plain string (not JSON), return it directly
      if (!codeToProcess.trim().startsWith('{') && !codeToProcess.trim().startsWith('[')) {
        return codeToProcess;
      }
      
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(codeToProcess);
        return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
      } catch {
        return codeToProcess;
      }
    }
    
    // Handle object input
    if (typeof codeToProcess === 'object') {
      return JSON.stringify(codeToProcess, null, 2);
    }

    return String(codeToProcess);
  } catch (error) {
    console.error('Error processing code:', error);
    return '// Error: Could not process code content';
  }
}; 