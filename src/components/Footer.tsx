import { Container, Row, Col } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import { CodeSquare } from 'react-bootstrap-icons'
import { TbApi } from 'react-icons/tb'
import { MdAnnouncement } from "react-icons/md"
import { VscGithub } from "react-icons/vsc"

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer py-3 py-md-4 mt-auto ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <Container>
        <Row className="align-items-center g-3">
          <Col xs={12} md={4} className="text-center text-md-start">
            <Link to="/" className={`text-decoration-none d-inline-flex align-items-center ${isDark ? 'text-light' : 'text-dark'}`}>
              <CodeSquare className="me-2" size={20} />
              <span className="fw-semibold">Code Snippets</span>
            </Link>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <small className="d-block">
              © {currentYear} Alec Hsu. All rights reserved.
            </small>
          </Col>
          <Col xs={12} md={4} className="text-center text-md-end">
            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end gap-2 gap-md-3">
              <div className="d-flex justify-content-center gap-2">
                <a 
                  href="https://github.com/hsu022210/Snippets-frontend" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-decoration-none d-inline-flex align-items-center ${isDark ? 'text-light' : 'text-dark'}`}
                  aria-label="Frontend GitHub Repository"
                >
                  <VscGithub className="me-1" size={18} />
                  <span>Frontend</span>
                </a>
                <a 
                  href="https://snippets-backend-69z8.onrender.com/swagger/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-decoration-none d-inline-flex align-items-center ${isDark ? 'text-light' : 'text-dark'}`}
                  aria-label="Backend GitHub Repository"
                >
                  <TbApi className="me-1" size={18} />
                  <span>Backend</span>
                </a>
              </div>
              <Link 
                to="/disclaimer" 
                className={`text-decoration-none d-inline-flex align-items-center justify-content-center ${isDark ? 'text-light' : 'text-dark'}`}
              >
                <MdAnnouncement className="me-1" size={18} />
                <span>Disclaimer</span>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 