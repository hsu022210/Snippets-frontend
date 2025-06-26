import { z } from 'zod';

// Base schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter');

export const usernameSchema = z
  .string()
  .min(1, 'Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be less than 50 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

// Snippet schemas
export const snippetDataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
});

export const snippetUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  code: z.string().min(1, 'Code is required').optional(),
  language: z.string().min(1, 'Language is required').optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const snippetFilterSchema = z.object({
  language: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  searchTitle: z.string().optional(),
  searchCode: z.string().optional(),
  page: z.number().min(1).optional(),
  page_size: z.number().min(1).max(100).optional(),
});

// API response schemas
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
});

export const loginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export const registerResponseSchema = z.object({
  message: z.string().optional(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
  }).optional(),
});

export const snippetSchema = z.object({
  id: z.string(),
  title: z.string(),
  code: z.string(),
  language: z.string(),
  created: z.string(),
  user: z.number().optional(),
});

export const snippetListResponseSchema = z.object({
  results: z.array(snippetSchema),
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;
export type SnippetData = z.infer<typeof snippetDataSchema>;
export type SnippetUpdateData = z.infer<typeof snippetUpdateSchema>;
export type SnippetFilterData = z.infer<typeof snippetFilterSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type Snippet = z.infer<typeof snippetSchema>;
export type SnippetListResponse = z.infer<typeof snippetListResponseSchema>;

// Validation helper functions
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map(err => {
    // If the error has a path, include it in the error message
    if (err.path.length > 0) {
      // For field-specific errors, format as "field: message"
      return `${err.path[0]}: ${err.message}`;
    }
    return err.message;
  });
  return { success: false, errors };
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const result = passwordSchema.safeParse(password);
  
  if (result.success) {
    return { isValid: true, errors: [] };
  }
  
  const errors = result.error.errors.map(err => err.message);
  return { isValid: false, errors };
}; 