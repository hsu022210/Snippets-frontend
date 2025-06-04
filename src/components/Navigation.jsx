import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Close navbar when route changes
  useEffect(() => {
    setExpanded(false);
  }, [location]);

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.getElementById('responsive-navbar-nav');
      const toggle = document.querySelector('.navbar-toggler');
      
      if (expanded && navbar && toggle) {
        const clickedInside = navbar.contains(event.target) || toggle.contains(event.target);
        if (!clickedInside) {
          setExpanded(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [expanded]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setExpanded(false);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <LoadingSpinner show={isLoggingOut} />
      <Navbar 
        bg={isDark ? "dark" : "black"}
        data-bs-theme="dark"
        variant="dark"
        expand="lg" 
        fixed="top" 
        className={`custom-navbar ${isDark ? 'theme-dark' : 'theme-light'}`}
        expanded={expanded}
        onToggle={(isExpanded) => setExpanded(isExpanded)}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
            <i className="bi bi-code-square me-2"></i>
            Code Snippets
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="px-3" onClick={() => setExpanded(false)}>
                Home
              </Nav.Link>
              {user && (
                <>
                  <Nav.Link as={Link} to="/snippets" className="px-3" onClick={() => setExpanded(false)}>
                    My Snippets
                  </Nav.Link>
                  <Nav.Link as={Link} to="/create-snippet" className="px-3" onClick={() => setExpanded(false)}>
                    Create Snippet
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <Button
                variant="outline-light"
                size="sm"
                className="me-3 d-flex align-items-center"
                onClick={toggleTheme}
              >
                <i className={`bi bi-${isDark ? 'sun' : 'moon'} me-2`}></i>
                {isDark ? 'Light' : 'Dark'} Mode
              </Button>
              {user ? (
                <NavDropdown 
                  title={
                    <span className="text-light">
                      <i className="bi bi-person-circle me-2"></i>
                      {user.username}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                  className="nav-dropdown-custom"
                >
                  <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings" onClick={() => setExpanded(false)}>
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="px-3" onClick={() => setExpanded(false)}>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="px-3" onClick={() => setExpanded(false)}>
                    <i className="bi bi-person-plus me-2"></i>
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation; 