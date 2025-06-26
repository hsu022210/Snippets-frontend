import { describe, it, expect } from 'vitest';
import { registerSchema, validateFormDataWithFieldErrors } from './validationSchemas';

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