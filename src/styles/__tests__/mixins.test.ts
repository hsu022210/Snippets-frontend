import sass from 'sass';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from 'vitest';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SCSS Mixins', () => {
  describe('Breakpoint Mixins', () => {
    test('should compile breakpoint mixin with valid size', () => {
      const breakpointSCSS = `
        @use "mixins" as *;
        .test-breakpoint {
          @include breakpoint('md') {
            display: flex;
            flex-direction: column;
          }
        }
      `;

      const result = sass.compileString(breakpointSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('@media (min-width: 768px)');
      expect(result.css).toContain('display: flex');
      expect(result.css).toContain('flex-direction: column');
    });

    test('should compile breakpoint-down mixin with valid size', () => {
      const breakpointDownSCSS = `
        @use "mixins" as *;
        .test-breakpoint-down {
          @include breakpoint-down('md') {
            display: block;
            width: 100%;
          }
        }
      `;

      const result = sass.compileString(breakpointDownSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('@media (max-width: 768px)');
      expect(result.css).toContain('display: block');
      expect(result.css).toContain('width: 100%');
    });

    test('should handle invalid breakpoint sizes gracefully', () => {
      const invalidBreakpointSCSS = `
        @use "mixins" as *;
        .test-invalid-breakpoint {
          @include breakpoint('invalid') {
            color: red;
          }
        }
      `;
      const result = sass.compileString(invalidBreakpointSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });
      // Should compile without error but not include the media query
      expect(result.css).not.toContain('@media');
    });
  });

  describe('Flexbox Mixins', () => {
    test('should compile flex-center mixin', () => {
      const flexCenterSCSS = `
        @use "mixins" as *;
        .test-flex-center {
          @include flex-center;
        }
      `;

      const result = sass.compileString(flexCenterSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('display: flex');
      expect(result.css).toContain('align-items: center');
      expect(result.css).toContain('justify-content: center');
    });

    test('should compile flex-between mixin', () => {
      const flexBetweenSCSS = `
        @use "mixins" as *;
        .test-flex-between {
          @include flex-between;
        }
      `;

      const result = sass.compileString(flexBetweenSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('display: flex');
      expect(result.css).toContain('align-items: center');
      expect(result.css).toContain('justify-content: space-between');
    });
  });

  describe('Typography Mixins', () => {
    test('should compile font-size mixin with valid size', () => {
      const fontSizeSCSS = `
        @use "mixins" as *;
        .test-font-size {
          @include font-size('lg');
        }
      `;

      const result = sass.compileString(fontSizeSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('font-size: 1.25rem');
    });

    test('should handle invalid font size gracefully', () => {
      const invalidFontSizeSCSS = `
        @use "mixins" as *;
        .test-invalid-font-size {
          @include font-size('invalid');
        }
      `;

      const result = sass.compileString(invalidFontSizeSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      // Should compile without error but not include font-size
      expect(result.css).not.toContain('font-size:');
    });
  });

  describe('Spacing Mixins', () => {
    test('should compile spacing mixin with valid size', () => {
      const spacingSCSS = `
        @use "mixins" as *;
        .test-spacing {
          @include spacing('padding', 'md');
          @include spacing('margin', 'lg');
        }
      `;

      const result = sass.compileString(spacingSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('padding: 1.5rem');
      expect(result.css).toContain('margin: 2rem');
    });

    test('should compile spacing-x mixin with valid sizes', () => {
      const spacingXSCSS = `
        @use "mixins" as *;
        .test-spacing-x {
          @include spacing-x('padding', 'sm', 'md');
        }
      `;

      const result = sass.compileString(spacingXSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('padding: 1rem 1.5rem');
    });

    test('should handle invalid spacing sizes gracefully', () => {
      const invalidSpacingSCSS = `
        @use "mixins" as *;
        .test-invalid-spacing {
          @include spacing('padding', 'invalid');
        }
      `;

      const result = sass.compileString(invalidSpacingSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      // Should compile without error but not include padding
      expect(result.css).not.toContain('padding:');
    });
  });

  describe('Shadow Mixins', () => {
    test('should compile shadow mixin with different types', () => {
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

    test('should use default shadow type when none specified', () => {
      const defaultShadowSCSS = `
        @use "mixins" as *;
        .test-shadow-default {
          @include shadow();
        }
      `;

      const result = sass.compileString(defaultShadowSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)');
    });
  });

  describe('Border Radius Mixins', () => {
    test('should compile border-radius mixin with valid size', () => {
      const borderRadiusSCSS = `
        @use "mixins" as *;
        .test-border-radius {
          @include border-radius('lg');
        }
      `;

      const result = sass.compileString(borderRadiusSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('border-radius: 0.5rem');
    });

    test('should handle invalid border radius size gracefully', () => {
      const invalidBorderRadiusSCSS = `
        @use "mixins" as *;
        .test-invalid-border-radius {
          @include border-radius('invalid');
        }
      `;

      const result = sass.compileString(invalidBorderRadiusSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      // Should compile without error but not include border-radius
      expect(result.css).not.toContain('border-radius:');
    });
  });

  describe('Transition Mixins', () => {
    test('should compile transition mixin with default property', () => {
      const transitionSCSS = `
        @use "mixins" as *;
        .test-transition-default {
          @include transition();
        }
      `;

      const result = sass.compileString(transitionSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: all 0.2s ease-in-out');
    });

    test('should compile transition mixin with custom property', () => {
      const transitionCustomSCSS = `
        @use "mixins" as *;
        .test-transition-custom {
          @include transition('opacity');
        }
      `;

      const result = sass.compileString(transitionCustomSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: "opacity" 0.2s ease-in-out');
    });

    test('should compile transition-multi mixin with custom parameters', () => {
      const transitionMultiSCSS = `
        @use "mixins" as *;
        .test-transition-multi {
          @include transition-multi('opacity, transform', 0.5s, ease-out);
        }
      `;

      const result = sass.compileString(transitionMultiSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: opacity, transform 0.5s ease-out');
    });

    test('should compile transition-multi mixin with default parameters', () => {
      const transitionMultiDefaultSCSS = `
        @use "mixins" as *;
        .test-transition-multi-default {
          @include transition-multi('background-color, color');
        }
      `;

      const result = sass.compileString(transitionMultiDefaultSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: background-color, color 0.3s ease-in-out');
    });
  });

  describe('Hover Mixins', () => {
    test('should compile hover-lift mixin', () => {
      const hoverLiftSCSS = `
        @use "mixins" as *;
        .test-hover-lift {
          @include hover-lift;
        }
      `;

      const result = sass.compileString(hoverLiftSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out');
      expect(result.css).toContain('transform: translateY(-2px)');
      expect(result.css).toContain('box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)');
    });

    test('should compile hover-bg mixin with custom color and opacity', () => {
      const hoverBgSCSS = `
        @use "mixins" as *;
        .test-hover-bg {
          @include hover-bg(#007bff, 0.9);
        }
      `;

      const result = sass.compileString(hoverBgSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('background-color: #007bff');
      expect(result.css).toContain('opacity: 0.9');
    });

    test('should compile hover-bg mixin with default opacity', () => {
      const hoverBgDefaultSCSS = `
        @use "mixins" as *;
        .test-hover-bg-default {
          @include hover-bg(#007bff);
        }
      `;

      const result = sass.compileString(hoverBgDefaultSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('background-color: #007bff');
      expect(result.css).toContain('opacity: 0.8');
    });
  });

  describe('Mixin Combinations', () => {
    test('should combine multiple mixins in a single selector', () => {
      const combinedSCSS = `
        @use "mixins" as *;
        .test-combined {
          @include flex-center;
          @include shadow('lg');
          @include border-radius('base');
          @include transition('all');
        }
      `;
      const result = sass.compileString(combinedSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });
      expect(result.css).toContain('display: flex');
      expect(result.css).toContain('align-items: center');
      expect(result.css).toContain('justify-content: center');
      expect(result.css).toContain('box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)');
      expect(result.css).toContain('border-radius: 0.375rem');
      expect(result.css).toContain('transition: "all" 0.2s ease-in-out');
    });

    test('should use mixins within media queries', () => {
      const mediaQueryMixinsSCSS = `
        @use "mixins" as *;
        .test-media-mixins {
          @include breakpoint('md') {
            @include flex-between;
            @include spacing('padding', 'lg');
          }
        }
      `;

      const result = sass.compileString(mediaQueryMixinsSCSS, {
        loadPaths: [path.join(__dirname, '../')],
        style: 'expanded'
      });

      expect(result.css).toContain('@media (min-width: 768px)');
      expect(result.css).toContain('display: flex');
      expect(result.css).toContain('justify-content: space-between');
      expect(result.css).toContain('padding: 2rem');
    });
  });
}); 