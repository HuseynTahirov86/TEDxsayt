import { useCallback, useEffect } from "react";

export function useAnimation() {
  // Enhanced scroll animation with delay support
  const setupScrollAnimation = useCallback(() => {
    function reveal() {
      const reveals = document.querySelectorAll(".reveal");

      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          const delay = reveals[i].getAttribute('data-delay') || '0';
          (reveals[i] as HTMLElement).style.transitionDelay = `${delay}ms`;
          reveals[i].classList.add("active");
        }
      }
    }

    window.addEventListener("scroll", reveal);
    reveal(); // Initial check

    return () => {
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  // Parallax effect for elements
  const setupParallaxEffect = useCallback(() => {
    function parallax() {
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element) => {
        const position = window.scrollY;
        const speed = element.getAttribute('data-speed') || '0.5';
        (element as HTMLElement).style.transform = `translateY(${position * parseFloat(speed)}px)`;
      });
    }

    window.addEventListener("scroll", parallax);
    parallax(); // Initial check
    
    return () => {
      window.removeEventListener("scroll", parallax);
    };
  }, []);

  // Floating animation for elements
  const setupFloatingAnimation = useCallback(() => {
    function initFloating() {
      const floatingElements = document.querySelectorAll('.floating-element');
      
      floatingElements.forEach((element, index) => {
        const baseDelay = element.getAttribute('data-float-delay') || '0';
        const delay = parseInt(baseDelay) + (index * 300);
        (element as HTMLElement).style.animationDelay = `${delay}ms`;
      });
    }
    
    // Add the CSS for the floating animation if it doesn't exist
    if (!document.getElementById('floating-animation-style')) {
      const style = document.createElement('style');
      style.id = 'floating-animation-style';
      style.innerHTML = `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating-element {
          animation: float 3s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
    
    initFloating();
  }, []);

  // Marquee animation for logos sliding
  const setupMarqueeAnimation = useCallback(() => {
    // Add the CSS for the marquee animation if it doesn't exist
    if (!document.getElementById('marquee-animation-style')) {
      const style = document.createElement('style');
      style.id = 'marquee-animation-style';
      style.innerHTML = `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .marquee-container {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .marquee-content {
          display: flex;
          animation: marquee 30s linear infinite;
          white-space: nowrap;
        }
        .marquee-item {
          flex-shrink: 0;
          padding: 0 1rem;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Setup all animations at once
  useEffect(() => {
    setupScrollAnimation();
    setupParallaxEffect();
    setupFloatingAnimation();
    setupMarqueeAnimation();
  }, [setupScrollAnimation, setupParallaxEffect, setupFloatingAnimation, setupMarqueeAnimation]);

  return { 
    setupScrollAnimation, 
    setupParallaxEffect, 
    setupFloatingAnimation,
    setupMarqueeAnimation
  };
}
