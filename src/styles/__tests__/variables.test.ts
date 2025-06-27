import sass from 'sass';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from 'vitest';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SCSS Variables', () => {
  describe('Color Variables', () => {
    test('should define app color variables', () => {
      const colorSCSS = `
        @use "variables" as *;
        .test-colors {
          primary: $app-primary;
          secondary: $app-secondary;
          success: $app-success;
          info: $app-info;
          warning: $app-warning;
          danger: $app-danger;
          light: $app-light;
          dark: $app-dark;
        }
      `;

      const result = sass.compileString(colorSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('primary: var(--bs-primary)');
      expect(result.css).toContain('secondary: var(--bs-secondary)');
      expect(result.css).toContain('success: var(--bs-success)');
      expect(result.css).toContain('info: var(--bs-info)');
      expect(result.css).toContain('warning: var(--bs-warning)');
      expect(result.css).toContain('danger: var(--bs-danger)');
      expect(result.css).toContain('light: var(--bs-light)');
      expect(result.css).toContain('dark: var(--bs-dark)');
    });
  });

  describe('Spacing Variables', () => {
    test('should define content spacing values', () => {
      const spacingSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-spacing {
          xs: map.get($content-spacing, 'xs');
          sm: map.get($content-spacing, 'sm');
          md: map.get($content-spacing, 'md');
          lg: map.get($content-spacing, 'lg');
          xl: map.get($content-spacing, 'xl');
        }
      `;

      const result = sass.compileString(spacingSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('xs: 0.5rem');
      expect(result.css).toContain('sm: 1rem');
      expect(result.css).toContain('md: 1.5rem');
      expect(result.css).toContain('lg: 2rem');
      expect(result.css).toContain('xl: 3rem');
    });

    test('should define navbar height', () => {
      const navbarSCSS = `
        @use "variables" as *;
        .test-navbar {
          height: $navbar-height;
        }
      `;

      const result = sass.compileString(navbarSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('height: 56px');
    });
  });

  describe('Typography Variables', () => {
    test('should define font families', () => {
      const fontSCSS = `
        @use "variables" as *;
        .test-fonts {
          base: $font-family-base;
          code: $font-family-code;
        }
      `;

      const result = sass.compileString(fontSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('base: -apple-system, BlinkMacSystemFont');
      expect(result.css).toContain('code: source-code-pro, Menlo, Monaco');
    });

    test('should define font sizes', () => {
      const fontSizeSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-font-sizes {
          base: map.get($font-sizes, 'base');
          sm: map.get($font-sizes, 'sm');
          lg: map.get($font-sizes, 'lg');
        }
      `;

      const result = sass.compileString(fontSizeSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('base: 1rem');
      expect(result.css).toContain('sm: 0.875rem');
      expect(result.css).toContain('lg: 1.25rem');
    });
  });

  describe('Border Radius Variables', () => {
    test('should define border radius values', () => {
      const borderRadiusSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-border-radius {
          sm: map.get($border-radius, 'sm');
          base: map.get($border-radius, 'base');
          lg: map.get($border-radius, 'lg');
        }
      `;

      const result = sass.compileString(borderRadiusSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('sm: 0.25rem');
      expect(result.css).toContain('base: 0.375rem');
      expect(result.css).toContain('lg: 0.5rem');
    });
  });

  describe('Transition Variables', () => {
    test('should define transition base', () => {
      const transitionSCSS = `
        @use "variables" as *;
        .test-transition {
          base: $transition-base;
        }
      `;

      const result = sass.compileString(transitionSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('base: all 0.2s ease-in-out');
    });
  });

  describe('Shadow Variables', () => {
    test('should define shadow colors', () => {
      const shadowSCSS = `
        @use "variables" as *;
        .test-shadow-colors {
          light: $shadow-color-light;
          dark: $shadow-color-dark;
        }
      `;

      const result = sass.compileString(shadowSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('light: rgba(0, 0, 0, 0.1)');
      expect(result.css).toContain('dark: rgba(0, 0, 0, 0.2)');
    });

    test('should define shadow presets', () => {
      const shadowPresetsSCSS = `
        @use "variables" as *;
        .test-shadow-presets {
          card: $card-shadow;
          card-hover: $card-shadow-hover;
          container: $container-shadow;
        }
      `;

      const result = sass.compileString(shadowPresetsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('card: 0 2px 4px rgba(0, 0, 0, 0.1)');
      expect(result.css).toContain('card-hover: 0 4px 8px rgba(0, 0, 0, 0.2)');
      expect(result.css).toContain('container: 0 1px 3px rgba(0, 0, 0, 0.1)');
    });
  });

  describe('Breakpoint Variables', () => {
    test('should define breakpoint values', () => {
      const breakpointSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-breakpoints {
          sm: map.get($breakpoints, 'sm');
          md: map.get($breakpoints, 'md');
          lg: map.get($breakpoints, 'lg');
          xl: map.get($breakpoints, 'xl');
          xxl: map.get($breakpoints, 'xxl');
        }
      `;

      const result = sass.compileString(breakpointSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('sm: 576px');
      expect(result.css).toContain('md: 768px');
      expect(result.css).toContain('lg: 992px');
      expect(result.css).toContain('xl: 1200px');
      expect(result.css).toContain('xxl: 1400px');
    });
  });

  describe('Z-Index Variables', () => {
    test('should define z-index values', () => {
      const zIndexSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-z-index {
          dropdown: map.get($z-index, 'dropdown');
          sticky: map.get($z-index, 'sticky');
          fixed: map.get($z-index, 'fixed');
          modal-backdrop: map.get($z-index, 'modal-backdrop');
          modal: map.get($z-index, 'modal');
          popover: map.get($z-index, 'popover');
          tooltip: map.get($z-index, 'tooltip');
        }
      `;

      const result = sass.compileString(zIndexSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('dropdown: 1000');
      expect(result.css).toContain('sticky: 1020');
      expect(result.css).toContain('fixed: 1030');
      expect(result.css).toContain('modal-backdrop: 1040');
      expect(result.css).toContain('modal: 1050');
      expect(result.css).toContain('popover: 1060');
      expect(result.css).toContain('tooltip: 1070');
    });
  });
}); 