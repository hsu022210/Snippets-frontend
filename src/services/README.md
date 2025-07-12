# API Service Layer

This directory contains the refactored API service layer that centralizes all API calls and provides consistent error handling, type safety, and better separation of concerns.

## Architecture Overview

### Core Components

1. **`api.ts`** - Central API client with interceptors for authentication, error handling, and response validation using Zod
2. **`authService.ts`** - Authentication-related API calls
3. **`snippetService.ts`** - Snippet-related API calls
4. **`index.ts`** - Exports all services for easy importing
5. **`../utils/validationSchemas.ts`** - All Zod schemas for validation and type inference

### Type & Schema Organization

- All runtime validation and most types are defined using [Zod](https://zod.dev/) schemas in `src/utils/validationSchemas.ts`.
- Types are inferred from Zod schemas using `z.infer<typeof schema>` for full type safety.
- Some legacy/request/response interfaces remain in `src/types/` for compatibility.

  - **`src/utils/validationSchemas.ts`** - Zod schemas for forms, API requests, and responses (single source of truth)
  - **`src/types/`** - Additional interfaces and type aliases

### Key Features

- **Centralized Configuration**: All API configuration is managed in one place
- **Automatic Token Management**: Handles JWT token refresh automatically
- **Consistent Error Handling**: All errors are wrapped in a custom `ApiError` class
- **Type Safety**: Full TypeScript support with types inferred from Zod schemas
- **Service Separation**: Different API domains are separated into dedicated services
- **Clean Type Organization**: All interfaces and types are centralized in the types folder
- **Runtime Validation**: All API responses and form data are validated at runtime using Zod

## Validation and Zod Schemas

All validation logic and most types are defined using [Zod](https://zod.dev/) in `src/utils/validationSchemas.ts`.

- **Form validation**: Login, register, password reset, snippet forms, etc.
- **API request/response validation**: All API responses are validated against Zod schemas.
- **Type inference**: Types are inferred from schemas using `z.infer<typeof schema>`.
- **Validation utilities**: Helper functions for validating form data and extracting errors.

**Example: Defining and using a Zod schema**

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Infer TypeScript type from schema
export type LoginFormData = z.infer<typeof loginSchema>;

// Validate data
const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
if (!result.success) {
  // result.error.format() gives field-level errors
}
```

**API response validation example:**

```typescript
import { loginResponseSchema } from '../utils/validationSchemas';
const response = await apiClient.post('/auth/login/', data, undefined, loginResponseSchema);
```

**Form validation utility:**

```typescript
import { validateFormData } from '../utils/validationSchemas';
const result = validateFormData(loginSchema, formData);
if (!result.success) {
  // result.errors is an array of error messages
}
```

## Usage

### Basic Usage

```typescript
import { authService, snippetService } from '../services';
import { LoginFormData, SnippetFilterData } from '../utils/validationSchemas';

// Authentication
const user = await authService.getCurrentUser();
const loginResult = await authService.login(email, password); // Validated with Zod

// Snippets
const filters: SnippetFilterData = { language: 'javascript', page: 1 };
const snippets = await snippetService.getSnippets(filters);
const snippet = await snippetService.getSnippet(123);
```

### With useApiRequest Hook

```typescript
import { useApiRequest } from '../hooks/useApiRequest';
import { authService } from '../services';
import { loginSchema } from '../utils/validationSchemas';

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

Zod validation errors are returned as arrays of error messages or field-level errors.

```typescript
import { ApiError } from '../services';
import { validateFormData } from '../utils/validationSchemas';

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

// Zod validation
const result = validateFormData(loginSchema, formData);
if (!result.success) {
  // result.errors is an array of error messages
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

const snippets = await snippetService.getSnippets(); // Validated with Zod
```

## Type Imports

Import types directly from Zod schemas for runtime and compile-time safety:

```typescript
import {
  User,
  LoginFormData,
  RegisterFormData,
  Snippet,
  SnippetFilterData,
  CreateSnippetRequest,
  UpdateSnippetRequest
} from '../utils/validationSchemas';
```

## Benefits of the New Architecture

1. **Better Separation of Concerns**: API logic is separated from UI components
2. **Consistent Error Handling**: All errors follow the same pattern
3. **Type Safety**: Full TypeScript support with types inferred from Zod schemas
4. **Easier Testing**: Services can be easily mocked for testing
5. **Centralized Configuration**: All API settings in one place
6. **Automatic Token Management**: No need to manually handle token refresh
7. **Better Maintainability**: Changes to API endpoints only require updates in services
8. **Clean Type Organization**: All interfaces and types are centralized and reusable
9. **Runtime Validation**: All API responses and form data are validated at runtime

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
│   ├── index.ts            # Service exports
│   └── README.md           # This file
├── utils/
│   └── validationSchemas.ts # Zod schemas for validation and type inference
└── types/
    ├── auth.ts            # Additional authentication types
    ├── snippet.ts         # Additional snippet types
    ├── api.ts             # General API types
    └── index.ts           # Type exports
```

## Contact Service

### `contactService.sendContactMessage`

Sends a contact form message to the backend `/contact/` endpoint.

**Parameters:**
- `name` (string): Sender's name
- `email` (string): Sender's email address
- `subject` (string): Subject of the message
- `message` (string): The message content

**Usage:**
```js
await contactService.sendContactMessage({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Hello',
  message: 'I love your site!'
});
```

