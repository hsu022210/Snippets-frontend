import { Container } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer py-3 mt-auto ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <Container fluid className={`text-center ${isDark ? 'text-light' : 'text-dark'}`}>
        <p className="mb-0">
          © {currentYear} Alec Hsu. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer; 