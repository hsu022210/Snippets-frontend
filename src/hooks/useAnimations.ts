import { useEffect } from 'react';
import { animate, inView } from 'motion';

export const useAnimations = () => {
  useEffect(() => {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      animate(
        mainContainer,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.6 }
      );
    }

    inView('.card, .btn', (element: Element) => {
      animate(
        element,
        { opacity: [0, 1], scale: [0.95, 1] },
        { duration: 0.5 }
      );
    }, { margin: '-10% 0px -10% 0px' });
  }, []);
};

 