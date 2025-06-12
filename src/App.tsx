import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CodeMirrorThemeProvider } from './contexts/CodeMirrorThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SnippetList from './pages/SnippetList';
import SnippetDetail from './pages/SnippetDetail';
import CreateSnippet from './pages/CreateSnippet';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Container from './components/shared/Container';
import Disclaimer from './components/Disclaimer';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <ThemeProvider>
        <CodeMirrorThemeProvider>
          <AuthProvider>
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
                  </Routes>
                </Container>
                <Footer />
              </div>
            </Router>
          </AuthProvider>
        </CodeMirrorThemeProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App; 