# Code Snippets Frontend

A modern, responsive web application for managing and organizing code snippets across multiple programming languages. Built with React, TypeScript, and Vite, featuring a beautiful UI with customizable themes and comprehensive testing.

## 🌐 Live Demo

**[View Live Website](https://snippets-frontend-ogbf.onrender.com/)**

## 📋 Table of Contents

- [Features](#-features)
- [Supported Languages](#-supported-languages)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Syntax Highlighting**: Support for 15+ programming languages with beautiful syntax highlighting
- **Customizable Themes**: Multiple CodeMirror themes with live preview
- **Primary Color Customization**: Dynamic color picker for app-wide theming
- **Rich Text Editing**: Advanced code editor with CodeMirror integration
- **Responsive Design**: Mobile-first design with Bootstrap components
- **Advanced Search & Filtering**: Powerful search and filtering capabilities with URL-based state persistence
- **Comprehensive Testing**: Full test coverage with Vitest and React Testing Library
- **Dark/Light Mode**: Theme switching with persistent preferences
- **User Authentication**: Secure login/register system with robust validation using Zod and global state management via Zustand
- **Type-Safe Validation**: All forms and API responses are validated with Zod schemas for reliability
- **Contact Page**: Users can send a message to the site owner via a validated contact form (name, email, subject, message)

## 🚀 Supported Languages

- JavaScript
- TypeScript
- Python
- Java
- C++
- C
- HTML
- CSS
- SQL
- JSON
- Markdown
- Rust
- PHP
- XML
- YAML

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Bootstrap 5** - Responsive CSS framework
- **React Bootstrap** - Bootstrap components for React
- **SCSS** - Advanced CSS preprocessing
- **React Icons** - Icon library

### Code Editing
- **CodeMirror 6** - Advanced code editor
- **@uiw/react-codemirror** - React wrapper for CodeMirror
- **Multiple Language Support** - 15+ programming languages

### Validation & Type Safety
- **Zod** - TypeScript-first schema validation for forms and API responses

### Testing & Quality
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and quality
- **TypeScript Strict Mode** - Enhanced type safety

### Development Tools
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Date-fns** - Date manipulation utilities

### State Management
- **Zustand** - Lightweight, scalable state management for authentication and global state

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/hsu022210/Snippets-frontend.git
cd Snippets-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 💻 Development

This project uses TypeScript with strict type checking and ESLint for code quality. The development environment is set up with Vite for fast development and hot module replacement (HMR).

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── snippet/        # Snippet-related components
│   └── shared/         # Shared/common components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── stores/             # Global state management (Zustand)
├── styles/             # SCSS styles and variables
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── test/               # Test setup and utilities
├── services/           # Centralized API service layer (with Zod validation)
```

### Code Style Guidelines

- Follow TypeScript strict mode guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Write tests for new features
- Follow existing code patterns and conventions
- Use proper TypeScript types and interfaces
- Use Zod schemas for all validation and type inference

### Customizing the Primary Color

You can customize the primary color used throughout the app from the Settings page. The color picker modal provides a live preview for buttons and pagination components.

### Editor & Display Settings

The Settings page now allows users to:
- Select a CodeMirror theme for the code editor
- Adjust the snippet preview height (with live preview)
- Change the primary color (with modal and live preview)
- Set pagination size for snippet lists

### Improved Filtering & Search

Snippet filtering now supports:
- Language selection
- Date range filtering (created after/before)
- Title and code search
- All filters are persisted in localStorage for a better UX

### API Service Layer

All API calls are centralized in the `src/services/` directory, with:
- Consistent error handling via a custom `ApiError` class
- Automatic token management for authentication
- Zod-based response validation for all endpoints
- TypeScript types inferred from Zod schemas

## 🧪 Testing

The project uses Vitest for testing with comprehensive coverage. Write tests for:

- Component rendering and interactions
- User interactions and form submissions
- API calls and data handling
- Utility functions and hooks
- Error boundaries and edge cases

### Running Tests

```bash
npm run test        # Run tests in watch mode
npm run test:ui     # Run tests with UI interface
npm run test:coverage  # Generate coverage report
```

### Test Structure

- **Component Tests**: Test component rendering, props, and user interactions
- **Hook Tests**: Test custom hooks with proper setup and cleanup
- **Utility Tests**: Test pure functions and utility methods
- **Integration Tests**: Test component integration and data flow

## 📄 License

**Copyright Notice**: This project and its codebase are the intellectual property of Alec Hsu. This project should not be copied, reproduced, distributed, or used in any form without explicit written permission from the author. All rights are reserved.

The code, design, and implementation are protected by copyright law. Unauthorized use, copying, or distribution of this project or any of its components is strictly prohibited and may result in legal action.

---


