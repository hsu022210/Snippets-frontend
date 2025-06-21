# API Service Layer

This directory contains the refactored API service layer that centralizes all API calls and provides consistent error handling, type safety, and better separation of concerns.

## Architecture Overview

### Core Components

1. **`api.ts`** - Central API client with interceptors for authentication and error handling
2. **`authService.ts`** - Authentication-related API calls
3. **`snippetService.ts`** - Snippet-related API calls
4. **`index.ts`** - Exports all services for easy importing

### Type Organization

All TypeScript interfaces and types are defined in the `src/types/` folder:
- **`src/types/auth.ts`** - Authentication-related types (User, LoginResponse, etc.)
- **`src/types/snippet.ts`** - Snippet-related types (Snippet, SnippetFilters, etc.)
- **`src/types/api.ts`** - General API types (ApiErrorResponse, etc.)

### Key Features

- **Centralized Configuration**: All API configuration is managed in one place
- **Automatic Token Management**: Handles JWT token refresh automatically
- **Consistent Error Handling**: All errors are wrapped in a custom `ApiError` class
- **Type Safety**: Full TypeScript support with proper typing for all API responses
- **Service Separation**: Different API domains are separated into dedicated services
- **Clean Type Organization**: All interfaces and types are centralized in the types folder

## Usage

### Basic Usage

```typescript
import { authService, snippetService } from '../services';
import { LoginResponse, SnippetFilters } from '../types';

// Authentication
const user = await authService.getCurrentUser();
const loginResult: LoginResponse = await authService.login(email, password);

// Snippets
const filters: SnippetFilters = { language: 'javascript', page: 1 };
const snippets = await snippetService.getSnippets(filters);
const snippet = await snippetService.getSnippet(123);
```

### With useApiRequest Hook

```typescript
import { useApiRequest } from '../hooks/useApiRequest';
import { authService } from '../services';

const { makeRequest } = useApiRequest();

const handleLogin = async () => {
  try {
    const result = await makeRequest(
      () => authService.login(email, password),
      'Logging in...'
    );
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Error Handling

All API errors are wrapped in an `ApiError` class with the following properties:

- `message`: Human-readable error message
- `status`: HTTP status code
- `data`: Original error data from the server
- `isNetworkError`: Boolean indicating if it's a network connectivity issue

```typescript
import { ApiError } from '../services';

try {
  await authService.login(email, password);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Handle unauthorized
    } else if (error.isNetworkError) {
      // Handle network error
    }
  }
}
```

## Migration from Old API Calls

### Before (Old Pattern)
```typescript
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { api } = useAuth();
const response = await api.get('/snippets/');
const snippets = response.data;
```

### After (New Pattern)
```typescript
import { snippetService } from '../services';

const snippets = await snippetService.getSnippets();
```

## Type Imports

Import types directly from the types folder:

```typescript
import { 
  User, 
  LoginResponse, 
  RegisterResponse,
  Snippet, 
  SnippetFilters,
  CreateSnippetRequest,
  UpdateSnippetRequest 
} from '../types';
```

## Benefits of the New Architecture

1. **Better Separation of Concerns**: API logic is separated from UI components
2. **Consistent Error Handling**: All errors follow the same pattern
3. **Type Safety**: Full TypeScript support with proper typing
4. **Easier Testing**: Services can be easily mocked for testing
5. **Centralized Configuration**: All API settings in one place
6. **Automatic Token Management**: No need to manually handle token refresh
7. **Better Maintainability**: Changes to API endpoints only require updates in services
8. **Clean Type Organization**: All interfaces and types are centralized and reusable

## Testing

Services can be easily mocked in tests:

```typescript
import { authService } from '../services';

// Mock the service
jest.mock('../services', () => ({
  authService: {
    login: jest.fn(),
    getCurrentUser: jest.fn(),
  }
}));
```

## File Structure

```
src/
├── services/
│   ├── api.ts              # Central API client
│   ├── authService.ts      # Authentication service
│   ├── snippetService.ts   # Snippet service
│   ├── index.ts           # Service exports
│   └── README.md          # This file
└── types/
    ├── auth.ts            # Authentication types
    ├── snippet.ts         # Snippet types
    ├── api.ts             # General API types
    └── index.ts           # Type exports
``` 