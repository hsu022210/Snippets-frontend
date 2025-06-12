import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import LogoutLoadingSpinner from './LogoutLoadingSpinner';
import { 
  CodeSquare, 
  Sun, 
  Moon, 
  PersonCircle, 
  Person, 
  Gear, 
  BoxArrowRight,
  BoxArrowInRight,
  PersonPlus
} from 'react-bootstrap-icons';

const Navigation: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
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
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById('responsive-navbar-nav');
      const toggle = document.querySelector('.navbar-toggler');
      
      if (expanded && navbar && toggle) {
        const clickedInside = navbar.contains(event.target as Node) || toggle.contains(event.target as Node);
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
      const success = await logout();
      if (success) {
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <LogoutLoadingSpinner show={isLoggingOut} />
      <Navbar 
        bg={isDark ? "dark" : "black"}
        data-bs-theme="dark"
        variant="dark"
        expand="lg" 
        fixed="top" 
        className={`custom-navbar ${isDark ? 'theme-dark' : 'theme-light'}`}
        expanded={expanded}
        onToggle={(isExpanded: boolean) => setExpanded(isExpanded)}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
            <CodeSquare className="me-2" size={20} />
            Code Snippets
          </Navbar.Brand>
          <Nav.Item className="d-flex align-items-center me-2">
            <Button
              variant="outline-light"
              size="md"
              className="theme-toggle-btn"
              onClick={(e) => {
                e.currentTarget.blur();
                toggleTheme();
              }}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <div className="theme-icon-wrapper">
                {isDark ? (
                  <Sun className="theme-icon" size={18} />
                ) : (
                  <Moon className="theme-icon" size={18} />
                )}
              </div>
            </Button>
          </Nav.Item>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
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
              {user ? (
                <NavDropdown 
                  title={
                    <span className="text-light d-flex align-items-center">
                      <PersonCircle className="me-2" size={20} />
                      <span>{user.username}</span>
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                  className="nav-dropdown-custom d-flex align-items-center"
                >
                  <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                    <Person className="me-2" size={18} />
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings" onClick={() => setExpanded(false)}>
                    <Gear className="me-2" size={18} />
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <BoxArrowRight className="me-2" size={18} />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="px-3" onClick={() => setExpanded(false)}>
                    <BoxArrowInRight className="me-2" size={18} />
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="px-3" onClick={() => setExpanded(false)}>
                    <PersonPlus className="me-2" size={18} />
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