import { Card as BootstrapCard } from 'react-bootstrap';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any; // for other props
}

const Card = ({ children, className, hover = false, ...props }: CardProps) => {
  const getCardClasses = () => {
    const classes = ['custom-card'];
    
    if (hover) {
      classes.push('custom-card-hover');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <BootstrapCard className={getCardClasses()} {...props}>
      {children}
    </BootstrapCard>
  );
};

// Re-export Card subcomponents for convenience
export const { Body, Title, Subtitle, Text, Header, Footer } = BootstrapCard;

export default Card; 