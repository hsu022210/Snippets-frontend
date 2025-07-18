import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { useAuthStore } from './stores'
import { apiClient, authService } from './services'
import { useAnimations } from './hooks/useAnimations'
import PrivateRoute from './components/PrivateRoute'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SnippetList from './pages/SnippetList'
import SnippetDetail from './pages/SnippetDetail'
import CreateSnippet from './pages/CreateSnippet'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Container from './components/shared/Container'
import Disclaimer from './components/Disclaimer'
import Contact from './pages/Contact';
import AnimationDemo from './pages/AnimationDemo';

const App: React.FC = () => {
  // Initialize animations
  useAnimations();

  useEffect(() => {
    // Set up API client callbacks
    apiClient.setCallbacks(
      (access: string, refresh: string) => {
        useAuthStore.getState().setToken(access)
        authService.setTokens(access, refresh)
      },
      () => {
        useAuthStore.getState().setUser(null)
        useAuthStore.getState().setToken(null)
      }
    )

    // Initialize auth
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <ToastProvider>
      <ThemeProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Navigation />
            <Container fluid className="main-container flex-grow-1" pageContainer>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/snippets" element={
                  <PrivateRoute>
                    <SnippetList />
                  </PrivateRoute>
                } />
                <Route path="/snippets/:id" element={
                    <SnippetDetail />
                } />
                <Route path="/create-snippet" element={
                  <PrivateRoute>
                    <CreateSnippet />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/animation-demo" element={<AnimationDemo />} />
              </Routes>
            </Container>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App; 