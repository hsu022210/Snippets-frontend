import sass from 'sass';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect, beforeAll } from 'vitest';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SCSS Files', () => {
  let compiledCSS: string;

  beforeAll(() => {
    // Compile the main SCSS file
    const result = sass.compile(path.join(__dirname, '../main.scss'), {
      loadPaths: [path.join(__dirname, '../')],
      style: 'expanded'
    });
    compiledCSS = result.css;
  });

  describe('Variables', () => {
    test('should compile variables correctly', () => {
      const variablesSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-variables {
          color: $app-primary;
          background-color: $app-secondary;
          font-family: $font-family-base;
          border-radius: map.get($border-radius, 'base');
        }
      `;

      const result = sass.compileString(variablesSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('color: var(--bs-primary)');
      expect(result.css).toContain('background-color: var(--bs-secondary)');
      expect(result.css).toContain('font-family: -apple-system, BlinkMacSystemFont');
      expect(result.css).toContain('border-radius: 0.375rem');
    });

    test('should have correct spacing values', () => {
      const spacingSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-spacing {
          padding: map.get($content-spacing, 'xs');
          margin: map.get($content-spacing, 'lg');
        }
      `;

      const result = sass.compileString(spacingSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('padding: 0.5rem');
      expect(result.css).toContain('margin: 2rem');
    });

    test('should have correct breakpoint values', () => {
      const breakpointSCSS = `
        @use "sass:map";
        @use "variables" as *;
        .test-breakpoints {
          width: map.get($breakpoints, 'md');
          height: map.get($breakpoints, 'lg');
        }
      `;

      const result = sass.compileString(breakpointSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('width: 768px');
      expect(result.css).toContain('height: 992px');
    });
  });

  describe('Mixins', () => {
    test('should compile breakpoint mixins correctly', () => {
      const breakpointSCSS = `
        @use "mixins" as *;
        .test-breakpoint {
          @include breakpoint('md') {
            display: flex;
          }
        }
      `;

      const result = sass.compileString(breakpointSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('@media (min-width: 768px)');
      expect(result.css).toContain('display: flex');
    });

    test('should compile flexbox mixins correctly', () => {
      const flexSCSS = `
        @use "mixins" as *;
        .test-flex-center {
          @include flex-center;
        }
        .test-flex-between {
          @include flex-between;
        }
      `;

      const result = sass.compileString(flexSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('display: flex');
      expect(result.css).toContain('align-items: center');
      expect(result.css).toContain('justify-content: center');
      expect(result.css).toContain('justify-content: space-between');
    });

    test('should compile shadow mixins correctly', () => {
      const shadowSCSS = `
        @use "mixins" as *;
        .test-shadow-sm {
          @include shadow('sm');
        }
        .test-shadow-base {
          @include shadow('base');
        }
        .test-shadow-lg {
          @include shadow('lg');
        }
      `;

      const result = sass.compileString(shadowSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)');
      expect(result.css).toContain('box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)');
      expect(result.css).toContain('box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)');
    });

    test('should compile hover mixins correctly', () => {
      const hoverSCSS = `
        @use "mixins" as *;
        .test-hover-lift {
          @include hover-lift;
        }
        .test-hover-bg {
          @include hover-bg(#007bff, 0.9);
        }
      `;

      const result = sass.compileString(hoverSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out');
      expect(result.css).toContain('transform: translateY(-2px)');
      expect(result.css).toContain('background-color: #007bff');
      expect(result.css).toContain('opacity: 0.9');
    });
  });

  describe('Component Styles', () => {
    test('should compile card styles correctly', () => {
      const cardSCSS = `
        @use "components/card";
      `;

      const result = sass.compileString(cardSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.card');
      expect(result.css).toContain('background-color: var(--bs-card-bg)');
      expect(result.css).toContain('border: 1px solid var(--bs-card-border-color)');
      expect(result.css).toContain('.card-header');
      expect(result.css).toContain('.card-body');
      expect(result.css).toContain('.card-footer');
    });

    test('should compile navigation styles correctly', () => {
      const navSCSS = `
        @use "components/navigation";
      `;

      const result = sass.compileString(navSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.custom-navbar');
      expect(result.css).toContain('.navbar-brand');
      expect(result.css).toContain('.nav-link');
      expect(result.css).toContain('.theme-toggle-btn');
    });

    test('should compile container styles correctly', () => {
      const containerSCSS = `
        @use "components/container";
      `;

      const result = sass.compileString(containerSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.container');
    });

    test('should compile loading spinner styles correctly', () => {
      const spinnerSCSS = `
        @use "components/loading-spinner";
      `;

      const result = sass.compileString(spinnerSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.loading-overlay');
    });

    test('should include consistent transitions using mixins', () => {
      const transitionComponentsSCSS = `
        @use "components/card";
        @use "components/navigation";
      `;

      const result = sass.compileString(transitionComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out');
      expect(result.css).toContain('transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out');
    });
  });

  describe('Main SCSS Compilation', () => {
    test('should compile main.scss without errors', () => {
      expect(compiledCSS).toBeDefined();
      expect(compiledCSS.length).toBeGreaterThan(0);
    });

    test('should include base styles', () => {
      expect(compiledCSS).toContain('body {');
      expect(compiledCSS).toContain('code {');
      expect(compiledCSS).toContain('font-family: source-code-pro');
    });

    test('should include page container styles', () => {
      expect(compiledCSS).toContain('.page-container');
      expect(compiledCSS).toContain('min-height: calc(100vh - 56px)');
    });

    test('should include button styles', () => {
      expect(compiledCSS).toContain('.btn-primary');
      expect(compiledCSS).toContain('.btn-outline-primary');
      expect(compiledCSS).toContain('background-color: var(--bs-primary)');
    });

    test('should include pagination styles', () => {
      expect(compiledCSS).toContain('.page-item.active .page-link');
      expect(compiledCSS).toContain('.page-link');
    });

    test('should include dark theme styles', () => {
      expect(compiledCSS).toContain('[data-bs-theme=dark]');
      expect(compiledCSS).toContain('-webkit-text-fill-color: var(--bs-body-color)');
    });

    test('should include animation styles', () => {
      expect(compiledCSS).toContain('.fade-enter');
      expect(compiledCSS).toContain('.fade-exit');
      expect(compiledCSS).toContain('transition: opacity');
    });
  });

  describe('CSS Custom Properties', () => {
    test('should use CSS custom properties for theming', () => {
      expect(compiledCSS).toContain('var(--bs-primary)');
      expect(compiledCSS).toContain('var(--bs-body-bg)');
      expect(compiledCSS).toContain('var(--bs-body-color)');
      expect(compiledCSS).toContain('var(--bs-card-bg)');
    });

    test('should include transition properties for theme switching', () => {
      expect(compiledCSS).toContain('transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out');
      expect(compiledCSS).toContain('transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out');
    });
  });

  describe('Responsive Design', () => {
    test('should include media queries for responsive design', () => {
      expect(compiledCSS).toContain('@media (max-width:');
    });

    test('should have mobile-first responsive approach with max-width queries', () => {
      // Check for max-width media queries (mobile-first approach)
      const maxWidthMatches = compiledCSS.match(/@media \(max-width:/g);
      expect(maxWidthMatches).toBeTruthy();
      expect(maxWidthMatches!.length).toBeGreaterThan(0);
    });

    test('should include responsive breakpoints for navigation', () => {
      expect(compiledCSS).toContain('@media (max-width: 768px)');
    });

    test('should include responsive breakpoints for page container', () => {
      expect(compiledCSS).toContain('@media (max-width: 768px)');
      expect(compiledCSS).toContain('padding-top: calc(56px + 2rem)');
    });
  });

  describe('Accessibility', () => {
    test('should include focus states', () => {
      expect(compiledCSS).toContain(':focus');
    });

    test('should include hover states', () => {
      expect(compiledCSS).toContain(':hover');
    });

    test('should include proper color contrast considerations', () => {
      // Check that text colors are properly defined
      expect(compiledCSS).toContain('color: var(--bs-body-color)');
      expect(compiledCSS).toContain('color: var(--bs-card-color)');
    });
  });

  describe('Settings SCSS', () => {
    test('should compile settings-nav and nav-link styles', () => {
      const settingsSCSS = `
        @use "components/settings";
      `;
      const result = sass.compileString(settingsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });
      expect(result.css).toContain('.settings-nav');
      expect(result.css).toContain('.settings-nav .nav-link.active');
      expect(result.css).toContain('background-color: var(--bs-primary) !important');
      expect(result.css).toContain('color: white !important');
      expect(result.css).toContain('.settings-nav .nav-link:not(.active)');
      expect(result.css).toContain('color: var(--bs-body-color) !important');
    });
  });
}); 