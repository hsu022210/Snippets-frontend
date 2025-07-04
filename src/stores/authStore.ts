import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'
import { authService } from '../services'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
  register: (username: string, password: string, password2: string, email: string, first_name?: string, last_name?: string) => Promise<string>
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearError: () => set({ error: null }),

      initializeAuth: async () => {
        const { token } = get()
        if (token) {
          try {
            set({ isLoading: true })
            const userData = await authService.getCurrentUser()
            set({ user: userData, isLoading: false })
          } catch (error) {
            console.error('Error initializing user:', error)
            get().logout()
          }
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authService.login(email, password)
          authService.setTokens(response.access, response.refresh)
          
          const userData = await authService.getCurrentUser()
          
          set({ 
            user: userData, 
            token: response.access, 
            isLoading: false 
          })
          
          return true
        } catch (error) {
          console.error('Login error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          })
          return false
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })
          
          await authService.logout()
          authService.clearTokens()
          
          set({ 
            user: null, 
            token: null, 
            isLoading: false 
          })
          
          return true
        } catch (error) {
          console.error('Logout error:', error)
          // Still logout locally even if API call fails
          authService.clearTokens()
          set({ 
            user: null, 
            token: null, 
            isLoading: false 
          })
          return false
        }
      },

      register: async (username: string, password: string, password2: string, email: string, first_name?: string, last_name?: string) => {
        try {
          set({ isLoading: true, error: null })
          
          // First, register the user
          await authService.register(username, password, password2, email, first_name, last_name)
          
          // Then automatically log in the user to get tokens
          const loginResponse = await authService.login(email, password)
          authService.setTokens(loginResponse.access, loginResponse.refresh)
          
          // Fetch and set the user after login
          const userData = await authService.getCurrentUser()
          set({ 
            user: userData,
            token: loginResponse.access, 
            isLoading: false 
          })
          
          return loginResponse.access
        } catch (error) {
          console.error('Registration error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          })
          throw error
        }
      }
    }),
    {
      name: 'auth-storage',
      // Only persist token, not user data or loading states
      partialize: (state) => ({ token: state.token }),
    }
  )
)

export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthToken = () => useAuthStore((state) => state.token)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error) 