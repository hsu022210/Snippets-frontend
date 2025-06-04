import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SnippetList from './pages/SnippetList';
import SnippetDetail from './pages/SnippetDetail';
import CreateSnippet from './pages/CreateSnippet';
import Profile from './pages/Profile';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Container fluid className="main-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/snippets" element={
                <PrivateRoute>
                  <SnippetList />
                </PrivateRoute>
              } />
              <Route path="/snippets/:id" element={
                <PrivateRoute>
                  <SnippetDetail />
                </PrivateRoute>
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
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
