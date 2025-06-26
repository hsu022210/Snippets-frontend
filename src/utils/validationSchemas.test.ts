import { describe, it, expect } from 'vitest';
import {
  // Auth schemas
  loginSchema,
  registerSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
  
  // Snippet schemas
  snippetDataSchema,
  snippetUpdateSchema,
  snippetFilterSchema,
  
  // API response schemas
  userSchema,
  loginResponseSchema,
  registerResponseSchema,
  snippetSchema,
  snippetListResponseSchema,
  
  // Validation utilities
  validateFormData,
  validateFormDataWithFieldErrors,
  validatePassword,
  
  // Types
  type LoginFormData,
  type SnippetData,
  type SnippetUpdateData,
  type User,
  type Snippet,
} from './validationSchemas';

// ============================================================================
// AUTH SCHEMA TESTS
// ============================================================================

describe('Email Schema', () => {
  it('should validate a valid email', () => {
    const result = emailSchema.safeParse('test@example.com');
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = emailSchema.safeParse('invalid-email');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Please enter a valid email address');
    }
  });

  it('should reject empty email', () => {
    const result = emailSchema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Email is required');
    }
  });

  it('should reject email that is too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const result = emailSchema.safeParse(longEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Email must be less than 254 characters');
    }
  });
});

describe('Password Schema', () => {
  it('should validate a valid password', () => {
    const result = passwordSchema.safeParse('password123');
    expect(result.success).toBe(true);
  });

  it('should reject password that is too short', () => {
    const result = passwordSchema.safeParse('short');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Password must be at least 8 characters');
    }
  });

  it('should reject password without letters', () => {
    const result = passwordSchema.safeParse('12345678');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Password must contain at least one letter');
    }
  });

  it('should reject empty password', () => {
    const result = passwordSchema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Password is required');
    }
  });
});

describe('Username Schema', () => {
  it('should validate a valid username', () => {
    const result = usernameSchema.safeParse('testuser123');
    expect(result.success).toBe(true);
  });

  it('should reject username that is too short', () => {
    const result = usernameSchema.safeParse('ab');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Username must be at least 3 characters');
    }
  });

  it('should reject username that is too long', () => {
    const longUsername = 'a'.repeat(151);
    const result = usernameSchema.safeParse(longUsername);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Username must be less than 150 characters');
    }
  });

  it('should reject username with invalid characters', () => {
    const result = usernameSchema.safeParse('test-user');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Username can only contain letters, numbers, and underscores');
    }
  });
});

describe('Login Schema', () => {
  it('should validate valid login data', () => {
    const validData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject login with invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123'
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject login with empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: ''
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Register Schema Validation', () => {
  it('should validate a valid registration form', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, validData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should reject invalid email format', () => {
    const invalidData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBe('Please enter a valid email address');
      expect(result.generalErrors).toHaveLength(0);
    }
  });

  it('should reject empty email', () => {
    const invalidData = {
      username: 'testuser',
      email: '',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBe('Please enter a valid email address');
      expect(result.generalErrors).toHaveLength(0);
    }
  });

  it('should reject email that is too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const invalidData = {
      username: 'testuser',
      email: longEmail,
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBe('Email must be less than 254 characters');
      expect(result.generalErrors).toHaveLength(0);
    }
  });

  it('should reject mismatched passwords', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      password2: 'differentpassword'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.password2).toBe("Passwords don't match");
      expect(result.generalErrors).toHaveLength(0);
    }
  });

  it('should reject invalid username format', () => {
    const invalidData = {
      username: 'test-user', // contains hyphen which is not allowed
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.username).toBe('Username can only contain letters, numbers, and underscores');
      expect(result.generalErrors).toHaveLength(0);
    }
  });

  it('should reject password that is too short', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'short',
      password2: 'short'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.password).toBe('Password must be at least 8 characters');
      expect(result.generalErrors).toHaveLength(0);
    }
  });

  it('should reject password without letters', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: '12345678',
      password2: '12345678'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.password).toBe('Password must contain at least one letter');
      expect(result.generalErrors).toHaveLength(0);
    }
  });
});

describe('Password Reset Request Schema', () => {
  it('should validate valid password reset request', () => {
    const validData = {
      email: 'test@example.com'
    };

    const result = passwordResetRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email'
    };

    const result = passwordResetRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Password Reset Confirm Schema', () => {
  it('should validate valid password reset confirmation', () => {
    const validData = {
      token: 'valid-token-123',
      password: 'newpassword123'
    };

    const result = passwordResetConfirmSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty token', () => {
    const invalidData = {
      token: '',
      password: 'newpassword123'
    };

    const result = passwordResetConfirmSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid password', () => {
    const invalidData = {
      token: 'valid-token-123',
      password: 'short'
    };

    const result = passwordResetConfirmSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// SNIPPET SCHEMA TESTS
// ============================================================================

describe('Snippet Data Schema', () => {
  it('should validate valid snippet data', () => {
    const validData: SnippetData = {
      title: 'Test Snippet',
      code: 'console.log("Hello World");',
      language: 'javascript'
    };

    const result = snippetDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate snippet data with optional fields', () => {
    const validData: SnippetData = {
      title: 'Test Snippet',
      code: 'console.log("Hello World");',
      language: 'javascript',
      linenos: true,
      style: 'monokai'
    };

    const result = snippetDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidData = {
      title: '',
      code: 'console.log("Hello World");',
      language: 'javascript'
    };

    const result = snippetDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject title that is too long', () => {
    const longTitle = 'a'.repeat(101);
    const invalidData = {
      title: longTitle,
      code: 'console.log("Hello World");',
      language: 'javascript'
    };

    const result = snippetDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty code', () => {
    const invalidData = {
      title: 'Test Snippet',
      code: '',
      language: 'javascript'
    };

    const result = snippetDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty language', () => {
    const invalidData = {
      title: 'Test Snippet',
      code: 'console.log("Hello World");',
      language: ''
    };

    const result = snippetDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Snippet Update Schema', () => {
  it('should validate valid snippet update with all fields', () => {
    const validData: SnippetUpdateData = {
      title: 'Updated Snippet',
      code: 'console.log("Updated");',
      language: 'javascript',
      linenos: true,
      style: 'monokai'
    };

    const result = snippetUpdateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate snippet update with partial fields', () => {
    const validData: SnippetUpdateData = {
      title: 'Updated Snippet'
    };

    const result = snippetUpdateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty update object', () => {
    const invalidData = {};

    const result = snippetUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('At least one field must be provided');
    }
  });

  it('should reject update with invalid title', () => {
    const invalidData = {
      title: ''
    };

    const result = snippetUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Snippet Filter Schema', () => {
  it('should validate valid filter data', () => {
    const validData = {
      language: 'javascript',
      createdAfter: '2023-01-01',
      createdBefore: '2023-12-31',
      searchTitle: 'test',
      searchCode: 'console',
      page: 1,
      page_size: 20
    };

    const result = snippetFilterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate empty filter data', () => {
    const validData = {};

    const result = snippetFilterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid page number', () => {
    const invalidData = {
      page: 0
    };

    const result = snippetFilterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid page size', () => {
    const invalidData = {
      page_size: 101
    };

    const result = snippetFilterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// API RESPONSE SCHEMA TESTS
// ============================================================================

describe('User Schema', () => {
  it('should validate valid user data', () => {
    const validData: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    };

    const result = userSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      id: 1,
      username: 'testuser',
      email: 'invalid-email',
      first_name: 'Test',
      last_name: 'User'
    };

    const result = userSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Login Response Schema', () => {
  it('should validate valid login response', () => {
    const validData = {
      access: 'access-token-123',
      refresh: 'refresh-token-456'
    };

    const result = loginResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject missing access token', () => {
    const invalidData = {
      refresh: 'refresh-token-456'
    };

    const result = loginResponseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Register Response Schema', () => {
  it('should validate register response with message only', () => {
    const validData = {
      message: 'User registered successfully'
    };

    const result = registerResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate register response with user data', () => {
    const validData = {
      message: 'User registered successfully',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      }
    };

    const result = registerResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid user email in response', () => {
    const invalidData = {
      message: 'User registered successfully',
      user: {
        id: 1,
        username: 'testuser',
        email: 'invalid-email'
      }
    };

    const result = registerResponseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Snippet Schema', () => {
  it('should validate valid snippet data', () => {
    const validData: Snippet = {
      id: 1,
      title: 'Test Snippet',
      code: 'console.log("Hello World");',
      language: 'javascript',
      created: '2023-01-01T00:00:00Z',
      user: 1
    };

    const result = snippetSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate snippet without optional fields', () => {
    const validData: Snippet = {
      id: 1,
      title: 'Test Snippet',
      code: 'console.log("Hello World");',
      language: 'javascript',
      created: '2023-01-01T00:00:00Z'
    };

    const result = snippetSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe('Snippet List Response Schema', () => {
  it('should validate valid snippet list response', () => {
    const validData = {
      results: [
        {
          id: 1,
          title: 'Test Snippet',
          code: 'console.log("Hello World");',
          language: 'javascript',
          created: '2023-01-01T00:00:00Z'
        }
      ],
      count: 1,
      next: null,
      previous: null
    };

    const result = snippetListResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate empty results', () => {
    const validData = {
      results: [],
      count: 0,
      next: null,
      previous: null
    };

    const result = snippetListResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// VALIDATION UTILITY TESTS
// ============================================================================

describe('validateFormData', () => {
  it('should return success for valid data', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormData(registerSchema, validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should return errors for invalid data', () => {
    const invalidData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormData(registerSchema, invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain('email: Please enter a valid email address');
    }
  });
});

describe('validateFormDataWithFieldErrors', () => {
  it('should return success for valid data', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should return field errors for invalid data', () => {
    const invalidData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
      password2: 'password123'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBe('Please enter a valid email address');
      expect(result.generalErrors).toHaveLength(0);
    }
  });

  it('should handle general errors', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      password2: 'differentpassword'
    };

    const result = validateFormDataWithFieldErrors(registerSchema, invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.password2).toBe("Passwords don't match");
      expect(result.generalErrors).toHaveLength(0);
    }
  });
});

describe('validatePassword', () => {
  it('should return valid for correct password', () => {
    const result = validatePassword('password123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for short password', () => {
    const result = validatePassword('short');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('should return invalid for password without letters', () => {
    const result = validatePassword('12345678');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one letter');
  });

  it('should return invalid for empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  it('should return multiple errors for invalid password', () => {
    const result = validatePassword('123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
    expect(result.errors).toContain('Password must contain at least one letter');
  });
}); 