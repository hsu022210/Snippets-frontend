import { Button as BootstrapButton } from 'react-bootstrap'
import { ButtonProps } from '../../types/interfaces'
import { unfocusActiveElement } from '../../utils/dom'

const Button = ({ children, variant = 'primary', size, className, isMobile, onClick, ...props }: ButtonProps) => {
  const getButtonClasses = () => {
    const classes = [];
    
    if (size === 'lg' && isMobile) {
      classes.push('py-3');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    unfocusActiveElement();
  };

  return (
    <BootstrapButton
      variant={variant}
      size={size}
      className={getButtonClasses()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
};

export default Button; 