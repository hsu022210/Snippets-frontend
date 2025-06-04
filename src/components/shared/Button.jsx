import { Button as BootstrapButton } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', size, className, ...props }) => {
  const getButtonClasses = () => {
    const classes = [];
    
    if (size === 'lg' && props.isMobile) {
      classes.push('py-3');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <BootstrapButton
      variant={variant}
      size={size}
      className={getButtonClasses()}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  className: PropTypes.string,
  isMobile: PropTypes.bool,
};

export default Button; 