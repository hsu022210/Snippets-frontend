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
    expect(readmeContent).toMatch(/^# Code Snippets Frontend\n/)
  })

  it('should have a project description', () => {
    expect(readmeContent).toContain('A modern, responsive web application for managing and organizing code snippets')
  })

  it('should have a table of contents', () => {
    expect(readmeContent).toContain('## 📋 Table of Contents')
    expect(readmeContent).toContain('[Features](#-features)')
    expect(readmeContent).toContain('[Tech Stack](#-tech-stack)')
    expect(readmeContent).toContain('[Getting Started](#-getting-started)')
  })

  it('should have a live demo section with link', () => {
    expect(readmeContent).toContain('## 🌐 Live Demo')
    expect(readmeContent).toContain('https://snippets-frontend-ogbf.onrender.com/')
    expect(readmeContent).toMatch(/\[View Live Website\]\(https:\/\/snippets-frontend-ogbf\.onrender\.com\/\)/)
  })

  it('should list all supported languages', () => {
    const requiredLanguages = [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'C',
      'HTML',
      'CSS',
      'SQL',
      'JSON',
      'Markdown',
      'Rust',
      'PHP',
      'XML',
      'YAML'
    ]

    requiredLanguages.forEach(lang => {
      expect(readmeContent).toContain(lang)
    })
  })

  it('should have all required sections', () => {
    const requiredSections = [
      '## 🌐 Live Demo',
      '## ✨ Features',
      '## 🚀 Supported Languages',
      '## 🛠️ Tech Stack',
      '## 🚀 Getting Started',
      '## 💻 Development',
      '## 🧪 Testing',
      '## 📄 License'
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
      'React 19',
      'TypeScript',
      'Vite',
      'CodeMirror 6',
      'React Router',
      'Bootstrap 5',
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

  it('should have installation instructions', () => {
    expect(readmeContent).toContain('### Prerequisites')
    expect(readmeContent).toContain('### Installation')
    expect(readmeContent).toContain('npm install')
    expect(readmeContent).toContain('npm run dev')
  })

  it('should have project structure documentation', () => {
    expect(readmeContent).toContain('### Project Structure')
    expect(readmeContent).toContain('src/')
    expect(readmeContent).toContain('components/')
    expect(readmeContent).toContain('pages/')
  })

  it('should have copyright notice', () => {
    expect(readmeContent).toContain('Copyright Notice')
    expect(readmeContent).toContain('intellectual property of Alec Hsu')
    expect(readmeContent).toContain('should not be copied, reproduced, distributed, or used')
    expect(readmeContent).toContain('All rights are reserved')
  })

  it('should mention primary color customization', () => {
    expect(readmeContent.toLowerCase()).toMatch(/primary color/)
    expect(readmeContent).toMatch(/color picker modal/i)
    expect(readmeContent).toMatch(/live preview/i)
  })

  it('should have tech stack categories', () => {
    expect(readmeContent).toContain('### Frontend Framework')
    expect(readmeContent).toContain('### UI & Styling')
    expect(readmeContent).toContain('### Code Editing')
    expect(readmeContent).toContain('### Testing & Quality')
    expect(readmeContent).toContain('### Development Tools')
  })
}) 