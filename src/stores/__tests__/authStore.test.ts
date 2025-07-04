import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore, useAuthUser, useAuthToken, useAuthLoading, useAuthError } from '../authStore'

// Mock the auth service
vi.mock('../../services', () => ({
  authService: {
    getAccessToken: vi.fn(() => 'mock-token'),
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn()
  },
  apiClient: {
    setCallbacks: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the store to initial state
    act(() => {
      useAuthStore.setState({
        user: null,
        token: null,
        isLoading: false,
        error: null
      })
    })
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should update user state', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: 1, username: 'test', email: 'test@example.com', first_name: '', last_name: '' }
    
    act(() => {
      result.current.setUser(mockUser)
    })
    
    expect(result.current.user).toEqual(mockUser)
  })

  it('should update token state', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setToken('new-token')
    })
    
    expect(result.current.token).toBe('new-token')
  })

  it('should clear error state', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // First set an error
    act(() => {
      useAuthStore.setState({ error: 'Some error' })
    })
    
    expect(result.current.error).toBe('Some error')
    
    // Then clear it
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBeNull()
  })

  it('should provide selector hooks', () => {
    const { result: userResult } = renderHook(() => useAuthUser())
    const { result: tokenResult } = renderHook(() => useAuthToken())
    const { result: loadingResult } = renderHook(() => useAuthLoading())
    const { result: errorResult } = renderHook(() => useAuthError())
    
    expect(userResult.current).toBeNull()
    expect(tokenResult.current).toBeNull()
    expect(loadingResult.current).toBe(false)
    expect(errorResult.current).toBeNull()
  })

  it('should handle loading state during async operations', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.isLoading).toBe(false)
    
    // Set loading state directly
    act(() => {
      useAuthStore.setState({ isLoading: true })
    })
    
    expect(result.current.isLoading).toBe(true)
    
    // Clear loading state
    act(() => {
      useAuthStore.setState({ isLoading: false })
    })
    
    expect(result.current.isLoading).toBe(false)
  })
})