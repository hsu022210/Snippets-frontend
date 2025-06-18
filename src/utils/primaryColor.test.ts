import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import {
  PRIMARY_COLORS,
  getPrimaryColor,
  setPrimaryColor,
  getPrimaryColorLabel,
  PRIMARY_COLOR_KEY
} from './primaryColor'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: () => { store = {} }
  }
})()

// Patch localStorage methods
beforeAll(() => {
  vi.spyOn(window.localStorage, 'getItem').mockImplementation(localStorageMock.getItem)
  vi.spyOn(window.localStorage, 'setItem').mockImplementation(localStorageMock.setItem)
  vi.spyOn(window.localStorage, 'removeItem').mockImplementation(localStorageMock.removeItem)
  vi.spyOn(window.localStorage, 'clear').mockImplementation(localStorageMock.clear)
})

describe('primaryColor utils', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('PRIMARY_COLORS contains Bootstrap Blue and other expected colors', () => {
    const labels = PRIMARY_COLORS.map(c => c.label)
    expect(labels).toContain('Bootstrap Blue')
    expect(labels).toContain('Light Blue')
    expect(labels).toContain('Yellow')
    expect(PRIMARY_COLORS.find(c => c.value === '#0d6efd')).toBeDefined()
  })

  it('getPrimaryColor returns Bootstrap Blue by default', () => {
    expect(getPrimaryColor()).toBe('#0d6efd')
  })

  it('getPrimaryColor returns stored value if set', () => {
    localStorageMock.setItem(PRIMARY_COLOR_KEY, '#F9DC5C')
    expect(getPrimaryColor()).toBe('#F9DC5C')
  })

  it('setPrimaryColor stores the value in localStorage', () => {
    setPrimaryColor('#FF6B6B')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(PRIMARY_COLOR_KEY, '#FF6B6B')
    expect(localStorageMock.getItem(PRIMARY_COLOR_KEY)).toBe('#FF6B6B')
  })

  it('getPrimaryColorLabel returns the correct label for a known color', () => {
    expect(getPrimaryColorLabel('#0d6efd')).toBe('Bootstrap Blue')
    expect(getPrimaryColorLabel('#F9DC5C')).toBe('Yellow')
  })

  it('getPrimaryColorLabel returns "Custom" for an unknown color', () => {
    expect(getPrimaryColorLabel('#123456')).toBe('Custom')
  })
}) 