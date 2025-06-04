import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      navigate('/');
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-code-square me-2"></i>
          Code Snippets
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="px-3">Home</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/snippets" className="px-3">My Snippets</Nav.Link>
                <Nav.Link as={Link} to="/create-snippet" className="px-3">Create Snippet</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="bi bi-person-circle me-2"></i>
                    {user.username}
                  </span>
                } 
                id="user-dropdown"
                align="end"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">
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
                <Nav.Link as={Link} to="/login" className="px-3">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="px-3">
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 