import { Container as BootstrapContainer } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './Container.css';

const Container = ({ children, className, fluid, pageContainer, ...props }) => {
  const getContainerClasses = () => {
    const classes = ['custom-container'];
    
    if (pageContainer) {
      classes.push('page-container');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <BootstrapContainer fluid={fluid} className={getContainerClasses()} {...props}>
      {children}
    </BootstrapContainer>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  pageContainer: PropTypes.bool,
};

export default Container; 