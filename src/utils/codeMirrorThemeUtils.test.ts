// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
  getSelectedTheme,
  setSelectedTheme,
  getThemeOptions,
  getThemeExtension,
  getAvailableThemeKeys,
  THEME_LABELS
} from './codeMirrorThemeUtils'

describe('codeMirrorThemeUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should get and set selected theme in localStorage', () => {
    expect(getSelectedTheme()).toBe('copilot');
    setSelectedTheme('dracula');
    expect(getSelectedTheme()).toBe('dracula');
  });

  it('should return theme options with correct labels', () => {
    const options = getThemeOptions();
    expect(Array.isArray(options)).toBe(true);
    // Check a few known labels
    expect(options.find(opt => opt.value === 'dracula')?.label).toBe('Dracula');
    expect(options.find(opt => opt.value === 'copilot')?.label).toBe('Copilot');
  });

  it('should export THEME_LABELS and contain known keys', () => {
    expect(THEME_LABELS).toBeDefined();
    expect(THEME_LABELS.dracula).toBe('Dracula');
    expect(THEME_LABELS.copilot).toBe('Copilot');
  });

  it('should get a theme extension for a valid theme', () => {
    const ext = getThemeExtension('dracula');
    expect(ext).toBeDefined();
  });

  it('should return undefined for an invalid theme extension', () => {
    const ext = getThemeExtension('not-a-theme');
    expect(ext).toBeUndefined();
  });

  it('should dynamically enumerate all available theme keys', () => {
    const keys = getAvailableThemeKeys();
    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBeGreaterThan(0);
    // Should include some known themes
    expect(keys).toContain('dracula');
    expect(keys).toContain('copilot');
  });

  it('should provide a theme option for every available theme key', () => {
    const keys = getAvailableThemeKeys();
    const options = getThemeOptions();
    const optionValues = options.map(opt => opt.value);
    keys.forEach(key => {
      expect(optionValues).toContain(key);
    });
  });

  it('should get a valid Extension for every available theme', () => {
    const keys = getAvailableThemeKeys();
    keys.forEach(key => {
      const ext = getThemeExtension(key);
      expect(ext).toBeDefined();
      // Not all themes may be actual Extension instances, but should be usable
      // Optionally, check if it looks like a CodeMirror extension (has .extensionType or is an object)
      expect(typeof ext === 'object' || typeof ext === 'function').toBe(true);
    });
  });
}); 