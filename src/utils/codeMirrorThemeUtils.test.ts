// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
  getSelectedTheme,
  setSelectedTheme,
  getThemeOptions,
  getThemeExtension,
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
}); 