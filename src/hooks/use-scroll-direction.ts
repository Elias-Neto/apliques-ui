import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY;
      
      // Só atualiza se a diferença for maior que 10px e não estiver no topo
      if (scrollY > 10) {
        setIsScrollingDown(direction);
        setIsAtTop(false);
      } else {
        setIsAtTop(true);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  return { isScrollingDown, isAtTop };
} 