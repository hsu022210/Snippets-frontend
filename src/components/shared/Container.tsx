import { Container as BootstrapContainer } from 'react-bootstrap'
import { ContainerProps } from '../../types'

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