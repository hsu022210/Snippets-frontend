import sass from 'sass';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from 'vitest';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SCSS Components', () => {
  describe('Card Component', () => {
    test('should compile card styles with all sub-components', () => {
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
      expect(result.css).toContain('color: var(--bs-card-color)');
      expect(result.css).toContain('.card-header');
      expect(result.css).toContain('.card-body');
      expect(result.css).toContain('.card-title');
      expect(result.css).toContain('.card-text');
      expect(result.css).toContain('.card-footer');
    });

    test('should include hover effects on card', () => {
      const cardSCSS = `
        @use "components/card";
      `;

      const result = sass.compileString(cardSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.card:hover');
      expect(result.css).toContain('box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)');
    });

    test('should include transitions for theme switching', () => {
      const cardSCSS = `
        @use "components/card";
      `;

      const result = sass.compileString(cardSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out');
    });
  });

  describe('Navigation Component', () => {
    test('should compile navigation styles with theme variants', () => {
      const navSCSS = `
        @use "components/navigation";
      `;

      const result = sass.compileString(navSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.custom-navbar');
      expect(result.css).toContain('.theme-dark');
      expect(result.css).toContain('.theme-light');
      expect(result.css).toContain('.navbar-brand');
      expect(result.css).toContain('.nav-link');
      expect(result.css).toContain('.theme-toggle-btn');
    });

    test('should include responsive behavior', () => {
      const navSCSS = `
        @use "components/navigation";
      `;

      const result = sass.compileString(navSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('@media (max-width: 768px)');
      expect(result.css).toContain('padding: 0.5rem 1rem');
    });

    test('should include hover and focus states', () => {
      const navSCSS = `
        @use "components/navigation";
      `;

      const result = sass.compileString(navSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.navbar-brand:hover');
      expect(result.css).toContain('.nav-link:focus');
      expect(result.css).toContain('opacity: 0.85');
    });

    test('should include dropdown styles', () => {
      const navSCSS = `
        @use "components/navigation";
      `;

      const result = sass.compileString(navSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.nav-dropdown-custom');
      expect(result.css).toContain('.dropdown-toggle');
      expect(result.css).toContain('.dropdown-menu');
      expect(result.css).toContain('.dropdown-item');
    });
  });

  describe('Container Component', () => {
    test('should compile container styles', () => {
      const containerSCSS = `
        @use "components/container";
      `;

      const result = sass.compileString(containerSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.container');
    });
  });

  describe('Loading Spinner Component', () => {
    test('should compile loading spinner styles', () => {
      const spinnerSCSS = `
        @use "components/loading-spinner";
      `;

      const result = sass.compileString(spinnerSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.loading-overlay');
      expect(result.css).toContain('.spinner-container');
    });
  });

  describe('Password Input Component', () => {
    test('should compile password input styles', () => {
      const passwordSCSS = `
        @use "components/password-input";
      `;

      const result = sass.compileString(passwordSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.password-input');
    });
  });

  describe('Footer Component', () => {
    test('should compile footer styles', () => {
      const footerSCSS = `
        @use "components/footer";
      `;

      const result = sass.compileString(footerSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.footer');
    });
  });

  describe('Settings Component', () => {
    test('should compile settings styles', () => {
      const settingsSCSS = `
        @use "components/settings";
      `;

      const result = sass.compileString(settingsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.settings');
    });

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

  describe('Component Integration', () => {
    test('should compile all components together', () => {
      const allComponentsSCSS = `
        @use "components/card";
        @use "components/container";
        @use "components/loading-spinner";
        @use "components/navigation";
        @use "components/password-input";
        @use "components/footer";
        @use "components/settings";
      `;

      const result = sass.compileString(allComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('.card');
      expect(result.css).toContain('.container');
      expect(result.css).toContain('.loading-overlay');
      expect(result.css).toContain('.custom-navbar');
      expect(result.css).toContain('.password-input');
      expect(result.css).toContain('.footer');
      expect(result.css).toContain('.settings');
    });

    test('should maintain CSS custom properties for theming', () => {
      const themedComponentsSCSS = `
        @use "components/card";
        @use "components/navigation";
      `;

      const result = sass.compileString(themedComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('var(--bs-card-bg)');
      expect(result.css).toContain('var(--bs-card-border-color)');
      expect(result.css).toContain('var(--bs-card-color)');
      expect(result.css).toContain('var(--bs-body-bg)');
      expect(result.css).toContain('var(--bs-body-color)');
    });

    test('should include consistent spacing using mixins', () => {
      const spacingComponentsSCSS = `
        @use "components/card";
        @use "components/navigation";
      `;

      const result = sass.compileString(spacingComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      // Check for spacing values that should be consistent
      expect(result.css).toContain('padding: 0.5rem 1rem');
      expect(result.css).toContain('padding: 1.5rem');
    });

    test('should include consistent shadows using mixins', () => {
      const shadowComponentsSCSS = `
        @use "components/card";
        @use "components/navigation";
      `;

      const result = sass.compileString(shadowComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)');
      expect(result.css).toContain('box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)');
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

  describe('Component Responsiveness', () => {
    test('should include responsive breakpoints in components', () => {
      const responsiveComponentsSCSS = `
        @use "components/navigation";
      `;

      const result = sass.compileString(responsiveComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('@media (max-width: 768px)');
    });

    test('should have mobile-first responsive approach', () => {
      const responsiveComponentsSCSS = `
        @use "components/navigation";
      `;

      const result = sass.compileString(responsiveComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      // Check for max-width media queries (mobile-first)
      const maxWidthMatches = result.css.match(/@media \(max-width:/g);
      expect(maxWidthMatches).toBeTruthy();
    });
  });

  describe('Component Accessibility', () => {
    test('should include focus states in components', () => {
      const accessibleComponentsSCSS = `
        @use "components/navigation";
        @use "components/password-input";
      `;

      const result = sass.compileString(accessibleComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain(':focus');
    });

    test('should include hover states in components', () => {
      const hoverComponentsSCSS = `
        @use "components/card";
        @use "components/navigation";
      `;

      const result = sass.compileString(hoverComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain(':hover');
    });

    test('should use semantic color variables', () => {
      const semanticComponentsSCSS = `
        @use "components/card";
        @use "components/navigation";
      `;

      const result = sass.compileString(semanticComponentsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('var(--bs-card-color)');
      expect(result.css).toContain('var(--bs-body-color)');
      expect(result.css).toContain('var(--bs-light)');
    });
  });
}); 