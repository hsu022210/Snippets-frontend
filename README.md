# Code Snippets

A modern web application for managing and organizing code snippets across multiple programming languages. Built with React, TypeScript, and Vite.

## Features

- ✨ Syntax highlighting for multiple programming languages
- 🎨 Customizable themes for code display
- 🖌️ Customizable primary color for components (buttons, pagination, etc.)
- 📝 Rich text editing with CodeMirror
- 📱 Responsive design with Bootstrap
- 🧪 Comprehensive test coverage with Vitest
- 🔍 Advanced search and filtering capabilities

## Supported Languages

- JavaScript/TypeScript
- Python
- Java
- C++
- HTML/CSS
- SQL
- PHP
- Rust
- YAML
- JSON
- XML
- Markdown

## Tech Stack

- React
- TypeScript
- Vite
- CodeMirror
- React Router
- Bootstrap
- Vitest for testing
- ESLint for code quality

## Development

This project uses TypeScript with strict type checking and ESLint for code quality. The development environment is set up with Vite for fast development and hot module replacement (HMR).

### Code Style

- Follow the TypeScript strict mode guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Write tests for new features
- Follow the existing code style and patterns

### Customizing the Primary Color

You can customize the primary color used throughout the app (for all Bootstrap components) from the Settings page. The color picker modal provides a live preview for buttons and pagination.

### Testing

The project uses Vitest for testing. Write tests for:
- Component rendering
- User interactions
- API calls
- Utility functions

Run tests with:
```bash
npm run test        # Run tests in watch mode
npm run test:ui     # Run tests with UI
npm run test:coverage  # Generate coverage report
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
