import { z } from 'zod';

// Language enum based on backend API
export const LanguageEnum = z.enum([
  'abap', 'abnf', 'actionscript', 'actionscript3', 'ada', 'adl', 'agda', 'aheui', 'alloy',
  'ambienttalk', 'amdgpu', 'ampl', 'androidbp', 'ansys', 'antlr', 'antlr-actionscript',
  'antlr-cpp', 'antlr-csharp', 'antlr-java', 'antlr-objc', 'antlr-perl', 'antlr-python',
  'antlr-ruby', 'apacheconf', 'apl', 'applescript', 'arduino', 'arrow', 'arturo', 'asc',
  'asn1', 'aspectj', 'aspx-cs', 'aspx-vb', 'asymptote', 'augeas', 'autohotkey', 'autoit',
  'awk', 'bare', 'basemake', 'bash', 'batch', 'bbcbasic', 'bbcode', 'bc', 'bdd', 'befunge',
  'berry', 'bibtex', 'blitzbasic', 'blitzmax', 'blueprint', 'bnf', 'boa', 'boo', 'boogie',
  'bqn', 'brainfuck', 'bst', 'bugs', 'c', 'c-objdump', 'ca65', 'cadl', 'camkes', 'capdl',
  'capnp', 'carbon', 'cbmbas', 'cddl', 'ceylon', 'cfc', 'cfengine3', 'cfm', 'cfs', 'chaiscript',
  'chapel', 'charmci', 'cheetah', 'cirru', 'clay', 'clean', 'clojure', 'clojurescript',
  'cmake', 'cobol', 'cobolfree', 'codeql', 'coffeescript', 'comal', 'common-lisp',
  'componentpascal', 'console', 'coq', 'cplint', 'cpp', 'csharp', 'css', 'css+django',
  'css+erb', 'css+genshitext', 'css+lasso', 'css+mako', 'css+myghty', 'css+php', 'css+smarty',
  'css+spitfire', 'css+twig', 'css+ul4', 'css+velocity', 'css+erb', 'css+genshitext',
  'css+lasso', 'css+mako', 'css+myghty', 'css+php', 'css+smarty', 'css+spitfire', 'css+twig',
  'css+ul4', 'css+velocity', 'cuda', 'cypher', 'cython', 'd', 'd-objdump', 'dart', 'data',
  'django', 'docker', 'dpatch', 'dtd', 'duel', 'dylan', 'dylan-console', 'dylan-lid',
  'dylan-repl', 'earl-grey', 'easytrieve', 'ebnf', 'ec', 'ecl', 'eiffel', 'elixir', 'elm',
  'emacs-lisp', 'erb', 'erl', 'erlang', 'evoque', 'factor', 'fan', 'fancy', 'felix',
  'fennel', 'fish', 'flatline', 'floscript', 'forth', 'fortran', 'fortranfixed', 'foxpro',
  'fsharp', 'gap', 'gas', 'gcc-machine-description', 'gdb', 'gdscript', 'genshi', 'genshitext',
  'glsl', 'gnuplot', 'go', 'golo', 'gooddata-cl', 'gosu', 'groovy', 'groovy-server-pages',
  'hack', 'haml', 'handlebars', 'haskell', 'haxe', 'hexdump', 'hlsl', 'hsail', 'html',
  'html+cheetah', 'html+django', 'html+erb', 'html+evoque', 'html+genshi', 'html+handlebars',
  'html+lasso', 'html+mako', 'html+myghty', 'html+php', 'html+smarty', 'html+spitfire',
  'html+twig', 'html+velocity', 'http', 'hx', 'hy', 'hybris', 'hylang', 'i6t', 'idl',
  'idris', 'iex', 'igor', 'inform', 'inform7', 'ini', 'io', 'ioke', 'ipython2', 'ipython3',
  'ipythonconsole', 'irc', 'isabelle', 'j', 'jade', 'jags', 'jasmin', 'java', 'javascript',
  'javascript+cheetah', 'javascript+django', 'javascript+lasso', 'javascript+mako',
  'javascript+myghty', 'javascript+php', 'javascript+smarty', 'javascript+spitfire',
  'javascript+twig', 'javascript+velocity', 'jcl', 'jsgf', 'jslt', 'json', 'json-ld',
  'jsonml+bst', 'jsp', 'julia', 'juttle', 'kal', 'kconfig', 'kernel-config', 'koka',
  'kotlin', 'lasso', 'lean', 'less', 'lighttpd', 'limbo', 'liquid', 'literate-agda',
  'literate-cryptol', 'literate-haskell', 'literate-idris', 'llvm', 'llvm-mir', 'llvm-mir-body',
  'logos', 'logtalk', 'lsl', 'lua', 'm68k', 'make', 'mako', 'maql', 'markdown', 'mask',
  'mason', 'mathematica', 'matlab', 'matlabsession', 'minid', 'modelica', 'modula2',
  'monkey', 'monte', 'moocode', 'moon', 'mosel', 'mozhashpreproc', 'mozpercentpreproc',
  'mql', 'mscgen', 'mupad', 'mxml', 'myghty', 'mysql', 'nasm', 'ncl', 'nemerle', 'nesc',
  'newlisp', 'newspeak', 'ng2', 'nginx', 'nim', 'nit', 'nixos', 'notmuch', 'nsis', 'numpy',
  'nusmv', 'objdump', 'objdump-nasm', 'objective-c', 'objective-c++', 'objective-j',
  'ocaml', 'octave', 'odin', 'ooc', 'opa', 'openedge', 'pan', 'parasail', 'pawn', 'pcmk',
  'perl', 'perl6', 'php', 'pig', 'pike', 'pkgconfig', 'plpgsql', 'pointless', 'pony',
  'postgresql', 'postscript', 'pot', 'pov', 'powershell', 'praat', 'prolog', 'properties',
  'protobuf', 'psql', 'psql-console', 'psql3', 'pug', 'puppet', 'py+ul4', 'pycon', 'pypylog',
  'python', 'python2', 'qbasic', 'qml', 'qvto', 'racket', 'ragel', 'ragel-c', 'ragel-cpp',
  'ragel-d', 'ragel-em', 'ragel-java', 'ragel-objc', 'ragel-ruby', 'raw', 'rb', 'rbcon',
  'rconsole', 'rd', 'reasonml', 'rebol', 'red', 'redcode', 'registry', 'resource', 'restructuredtext',
  'rexx', 'rhtml', 'rng-compact', 'roboconf-graph', 'roboconf-instances', 'robotframework',
  'rql', 'rsl', 'ruby', 'rust', 'sarl', 'sas', 'sass', 'scala', 'scaml', 'scheme', 'scilab',
  'scss', 'sed', 'sgf', 'shen', 'sieve', 'silver', 'slash', 'slim', 'smali', 'smalltalk',
  'smarty', 'sml', 'snobol', 'snowball', 'solidity', 'sp', 'sparql', 'spitfire', 'splus',
  'sql', 'sqlite3', 'squidconf', 'ssp', 'stan', 'swift', 'swig', 'systemverilog', 'tads3',
  'tap', 'tasm', 'tcl', 'tcsh', 'tea', 'termcap', 'terminfo', 'terraform', 'tex', 'text',
  'thrift', 'tiddler', 'todotxt', 'trac-wiki', 'treetop', 'tsql', 'turtle', 'typescript',
  'typoscript', 'typoscriptcssdata', 'typoscripthtmldata', 'ucode', 'unicon', 'urbiscript',
  'usd', 'vala', 'vb.net', 'vbscript', 'vcl', 'vclsnippets', 'vclsnippets', 'vctreestatus',
  'velocity', 'verilog', 'vgl', 'vhdl', 'vim', 'wdiff', 'webidl', 'xml', 'xml+cheetah',
  'xml+django', 'xml+erb', 'xml+evoque', 'xml+lasso', 'xml+mako', 'xml+myghty', 'xml+php',
  'xml+smarty', 'xml+spitfire', 'xml+twig', 'xml+velocity', 'xquery', 'xslt', 'xtend',
  'xul+mozpreproc', 'yaml', 'zephir', 'zig'
]);

// Style enum based on backend API
export const StyleEnum = z.enum([
  'abap', 'algol', 'algol_nu', 'arduino', 'autumn', 'borland', 'bw', 'coffee', 'colorful',
  'default', 'dracula', 'emacs', 'friendly', 'friendly_grayscale', 'fruity', 'github-dark',
  'gruvbox-dark', 'gruvbox-light', 'igor', 'inkpot', 'lightbulb', 'lilypond', 'lovelace',
  'manni', 'material', 'monokai', 'murphy', 'native', 'nord', 'one-dark', 'paraiso-dark',
  'paraiso-light', 'pastie', 'perldoc', 'rainbow_dash', 'rrt', 'sas', 'solarized-dark',
  'solarized-light', 'stata', 'stata-dark', 'stata-light', 'tango', 'trac', 'vim', 'vs',
  'xcode'
]);

// Base schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email must be less than 254 characters');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter');

export const usernameSchema = z
  .string()
  .min(1, 'Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(150, 'Username must be less than 150 characters')
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
  password2: z.string().min(1, 'Please confirm your password'),
  first_name: z.string().max(150, 'First name must be less than 150 characters').optional(),
  last_name: z.string().max(150, 'Last name must be less than 150 characters').optional(),
}).refine((data) => data.password === data.password2, {
  message: "Passwords don't match",
  path: ["password2"],
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
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  code: z.string().min(1, 'Code is required'),
  language: LanguageEnum,
  linenos: z.boolean().optional(),
  style: StyleEnum.optional(),
});

export const snippetUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
  code: z.string().min(1, 'Code is required').optional(),
  language: LanguageEnum.optional(),
  linenos: z.boolean().optional(),
  style: StyleEnum.optional(),
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
  language: LanguageEnum,
  linenos: z.boolean().optional(),
  style: StyleEnum.optional(),
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
export type Language = z.infer<typeof LanguageEnum>;
export type Style = z.infer<typeof StyleEnum>;

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