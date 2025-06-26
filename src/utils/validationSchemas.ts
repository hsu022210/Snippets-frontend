import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

const VALIDATION_MESSAGES = {
  REQUIRED: {
    EMAIL: 'Email is required',
    PASSWORD: 'Password is required',
    USERNAME: 'Username is required',
    TITLE: 'Title is required',
    CODE: 'Code is required',
    LANGUAGE: 'Language is required',
    TOKEN: 'Token is required',
    CONFIRM_PASSWORD: 'Please confirm your password',
  },
  LENGTH: {
    EMAIL_MAX: 'Email must be less than 254 characters',
    USERNAME_MIN: 'Username must be at least 3 characters',
    USERNAME_MAX: 'Username must be less than 150 characters',
    PASSWORD_MIN: 'Password must be at least 8 characters',
    TITLE_MAX: 'Title must be less than 100 characters',
    NAME_MAX: 'Name must be less than 150 characters',
  },
  FORMAT: {
    EMAIL: 'Please enter a valid email address',
    USERNAME: 'Username can only contain letters, numbers, and underscores',
    PASSWORD_LETTER: 'Password must contain at least one letter',
  },
  CUSTOM: {
    PASSWORDS_MATCH: "Passwords don't match",
    AT_LEAST_ONE_FIELD: 'At least one field must be provided',
  },
} as const;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

const createRequiredString = (message: string) => 
  z.string().min(1, message);

const createEmailSchema = () => 
  createRequiredString(VALIDATION_MESSAGES.REQUIRED.EMAIL)
    .email(VALIDATION_MESSAGES.FORMAT.EMAIL)
    .max(254, VALIDATION_MESSAGES.LENGTH.EMAIL_MAX);

const createPasswordSchema = () => 
  createRequiredString(VALIDATION_MESSAGES.REQUIRED.PASSWORD)
    .min(8, VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN)
    .regex(/[A-Za-z]/, VALIDATION_MESSAGES.FORMAT.PASSWORD_LETTER);

const createUsernameSchema = () => 
  createRequiredString(VALIDATION_MESSAGES.REQUIRED.USERNAME)
    .min(3, VALIDATION_MESSAGES.LENGTH.USERNAME_MIN)
    .max(150, VALIDATION_MESSAGES.LENGTH.USERNAME_MAX)
    .regex(/^[a-zA-Z0-9_]+$/, VALIDATION_MESSAGES.FORMAT.USERNAME);

const createTitleSchema = () => 
  createRequiredString(VALIDATION_MESSAGES.REQUIRED.TITLE)
    .max(100, VALIDATION_MESSAGES.LENGTH.TITLE_MAX);

const createCodeSchema = () => 
  createRequiredString(VALIDATION_MESSAGES.REQUIRED.CODE);

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const emailSchema = createEmailSchema();
export const passwordSchema = createPasswordSchema();
export const usernameSchema = createUsernameSchema();

export const loginSchema = z.object({
  email: emailSchema,
  password: createRequiredString(VALIDATION_MESSAGES.REQUIRED.PASSWORD),
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  password2: createRequiredString(VALIDATION_MESSAGES.REQUIRED.CONFIRM_PASSWORD),
}).refine(
  (data) => data.password === data.password2,
  {
    message: VALIDATION_MESSAGES.CUSTOM.PASSWORDS_MATCH,
    path: ["password2"],
  }
);

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const passwordResetConfirmSchema = z.object({
  token: createRequiredString(VALIDATION_MESSAGES.REQUIRED.TOKEN),
  password: passwordSchema,
});

// ============================================================================
// SNIPPET SCHEMAS
// ============================================================================

export const snippetDataSchema = z.object({
  title: createTitleSchema(),
  code: createCodeSchema(),
  language: createRequiredString(VALIDATION_MESSAGES.REQUIRED.LANGUAGE),
  linenos: z.boolean().optional(),
  style: z.string().optional(),
});

export const snippetUpdateSchema = z.object({
  title: createTitleSchema().optional(),
  code: createCodeSchema().optional(),
  language: createRequiredString(VALIDATION_MESSAGES.REQUIRED.LANGUAGE).optional(),
  linenos: z.boolean().optional(),
  style: z.string().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: VALIDATION_MESSAGES.CUSTOM.AT_LEAST_ONE_FIELD,
  }
);

export const snippetFilterSchema = z.object({
  language: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  searchTitle: z.string().optional(),
  searchCode: z.string().optional(),
  page: z.number().min(1).optional(),
  page_size: z.number().min(1).max(100).optional(),
});

// ============================================================================
// API RESPONSE SCHEMAS
// ============================================================================

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
  id: z.number(),
  title: z.string(),
  code: z.string(),
  language: z.string(),
  linenos: z.boolean().optional(),
  style: z.string().optional(),
  created: z.string(),
  user: z.number().optional(),
});

export const snippetListResponseSchema = z.object({
  results: z.array(snippetSchema),
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

// ============================================================================
// CORE TYPES (Single Source of Truth)
// ============================================================================

// Auth Types
export type User = z.infer<typeof userSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// Snippet Types
export type Snippet = z.infer<typeof snippetSchema>;
export type SnippetData = z.infer<typeof snippetDataSchema>;
export type SnippetUpdateData = z.infer<typeof snippetUpdateSchema>;
export type SnippetFilterData = z.infer<typeof snippetFilterSchema>;
export type SnippetListResponse = z.infer<typeof snippetListResponseSchema>;

// Utility Types
export type Language = string;
export type Style = string;

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface CreateSnippetRequest {
  title: string;
  code: string;
  language: Language;
  linenos?: boolean;
  style?: Style;
}

export interface UpdateSnippetRequest {
  title?: string;
  code?: string;
  language?: Language;
  linenos?: boolean;
  style?: Style;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export interface PasswordResetResponse {
  message: string;
}

// ============================================================================
// API ERROR TYPES
// ============================================================================

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface ApiRegisterErrorResponse {
  email?: string | string[];
  username?: string | string[];
  password?: string | string[];
  password2?: string | string[];
  detail?: string;
}

export interface ApiPasswordResetErrorResponse {
  password?: string | string[];
  password2?: string | string[];
  token?: string | string[];
  detail?: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface SnippetFilterValues {
  language: string;
  createdAfter: string;
  createdBefore: string;
  searchTitle: string;
  searchCode: string;
}

export interface FilterOptions {
  language?: string;
  createdAfter?: string;
  createdBefore?: string;
  searchTitle?: string;
  searchCode?: string;
}

export interface SnippetFilters extends FilterOptions {
  page?: number;
  page_size?: number;
}

// ============================================================================
// FORM DATA ALIASES (for backward compatibility)
// ============================================================================

export type FormData = LoginFormData;
export type UserProfile = Pick<User, 'username' | 'email' | 'first_name' | 'last_name'>;
export type PasswordFormData = {
  password: string;
  confirmPassword: string;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const validateFormData = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map(error => {
    if (error.path.length > 0) {
      return `${error.path[0]}: ${error.message}`;
    }
    return error.message;
  });
  return { success: false, errors };
};

export const validateFormDataWithFieldErrors = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; fieldErrors: Record<string, string>; generalErrors: string[] } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const fieldErrors: Record<string, string> = {};
  const generalErrors: string[] = [];
  
  result.error.errors.forEach(error => {
    const path = error.path.join('.');
    if (path) {
      fieldErrors[path] = error.message;
    } else {
      generalErrors.push(error.message);
    }
  });
  
  return { success: false, fieldErrors, generalErrors };
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const result = passwordSchema.safeParse(password);
  
  if (result.success) {
    return { isValid: true, errors: [] };
  }
  
  const errors = result.error.errors.map(error => error.message);
  return { isValid: false, errors };
}; 