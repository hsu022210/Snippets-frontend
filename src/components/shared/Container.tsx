import { Container as BootstrapContainer } from 'react-bootstrap';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
  pageContainer?: boolean;
  [key: string]: any; // for other props
}

const Container = ({ children, className, fluid, pageContainer, ...props }: ContainerProps) => {
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

export default Container; 