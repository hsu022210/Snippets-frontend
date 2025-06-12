import { Button as BootstrapButton } from 'react-bootstrap';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: string;
  size?: 'sm' | 'lg';
  className?: string;
  isMobile?: boolean;
  [key: string]: any; // for other props
}

const Button = ({ children, variant = 'primary', size, className, isMobile, ...props }: ButtonProps) => {
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

export default Button; 