import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('README.md', () => {
  const readmePath = path.resolve(process.cwd(), 'README.md')
  let readmeContent: string

  beforeAll(() => {
    readmeContent = fs.readFileSync(readmePath, 'utf-8')
  })

  it('should exist', () => {
    expect(fs.existsSync(readmePath)).toBe(true)
  })

  it('should have a title', () => {
    expect(readmeContent).toMatch(/^# Code Snippets\n/)
  })

  it('should have a project description', () => {
    expect(readmeContent).toContain('A modern web application for managing and organizing code snippets')
  })

  it('should list all supported languages', () => {
    const requiredLanguages = [
      'JavaScript/TypeScript',
      'Python',
      'Java',
      'C++',
      'HTML/CSS',
      'SQL',
      'PHP',
      'Rust',
      'YAML',
      'JSON',
      'XML',
      'Markdown'
    ]

    requiredLanguages.forEach(lang => {
      expect(readmeContent).toContain(lang)
    })
  })

  it('should have all required sections', () => {
    const requiredSections = [
      '## Features',
      '## Supported Languages',
      '## Tech Stack',
      '## Development',
      '## Contributing'
    ]

    requiredSections.forEach(section => {
      expect(readmeContent).toContain(section)
    })
  })

  it('should have development instructions', () => {
    expect(readmeContent).toContain('npm run test')
    expect(readmeContent).toContain('npm run test:ui')
    expect(readmeContent).toContain('npm run test:coverage')
  })

  it('should list all major technologies', () => {
    const requiredTech = [
      'React',
      'TypeScript',
      'Vite',
      'CodeMirror',
      'React Router',
      'Bootstrap',
      'Vitest',
      'ESLint'
    ]

    requiredTech.forEach(tech => {
      expect(readmeContent).toContain(tech)
    })
  })

  it('should have proper markdown formatting', () => {
    // Check for proper heading hierarchy
    expect(readmeContent).toMatch(/^# .+\n\n/)
    
    // Check for proper list formatting
    expect(readmeContent).toMatch(/^-\s.+\n/m)
    
    // Check for code block formatting (simplest form)
    expect(readmeContent).toContain('```')
  })

  it('should have contributing guidelines', () => {
    expect(readmeContent).toContain('## Contributing')
    expect(readmeContent).toContain('Fork the repository')
    expect(readmeContent).toContain('Create your feature branch')
    expect(readmeContent).toContain('Open a Pull Request')
  })

  it('should mention primary color customization', () => {
    expect(readmeContent.toLowerCase()).toMatch(/primary color/)
    expect(readmeContent).toMatch(/color picker modal/i)
    expect(readmeContent).toMatch(/live preview/i)
  })
}) 