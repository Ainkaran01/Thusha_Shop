
import React, { useState, useEffect } from 'react';

export type AnimationVariant = 
  | 'fade-in'
  | 'slide-in'
  | 'zoom-in'
  | 'bounce'
  | 'spin'
  | 'none';

interface AnimationOptions {
  variant: AnimationVariant;
  duration?: number;
  delay?: number;
  once?: boolean;
}

// Hook for applying animations to elements
export const useAnimation = ({
  variant = 'fade-in',
  duration = 500,
  delay = 0,
  once = true
}: AnimationOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const getAnimationClass = (): string => {
    switch (variant) {
      case 'fade-in':
        return 'animate-fade-in';
      case 'slide-in':
        return 'animate-slide-in';
      case 'zoom-in':
        return 'animate-zoom-in';
      case 'bounce':
        return 'animate-bounce';
      case 'spin':
        return 'animate-spin';
      default:
        return '';
    }
  };
  
  const ref = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (once && hasAnimated) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
          
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, once, hasAnimated]);
  
  const style = {
    opacity: variant === 'none' || isVisible ? 1 : 0,
    transition: `all ${duration}ms ease-out`,
  };
  
  const className = isVisible ? getAnimationClass() : '';
  
  return { ref, style, className, isVisible };
};

// Component wrapper for animations
interface AnimatedElementProps {
  children: React.ReactNode;
  options: AnimationOptions;
  className?: string;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({ 
  children, 
  options, 
  className = '' 
}) => {
  const { ref, style, className: animationClass, isVisible } = useAnimation(options);
  
  return (
    <div 
      ref={ref} 
      style={style} 
      className={`${className} ${animationClass}`}
    >
      {children}
    </div>
  );
};

// Hook for staggered animations of multiple elements
export const useStaggeredAnimation = (
  count: number, 
  baseDelay: number = 50
) => {
  return (index: number): number => {
    return baseDelay * index;
  };
};

// Preview animation before applying
export const useAnimationPreview = (variant: AnimationVariant) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const triggerAnimation = () => {
    setIsAnimating(true);
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };
  
  const getAnimationClass = (): string => {
    if (!isAnimating) return '';
    
    switch (variant) {
      case 'fade-in':
        return 'animate-fade-in';
      case 'slide-in':
        return 'animate-slide-in';
      case 'zoom-in':
        return 'animate-zoom-in';
      case 'bounce':
        return 'animate-bounce';
      case 'spin':
        return 'animate-spin';
      default:
        return '';
    }
  };
  
  return { triggerAnimation, animationClass: getAnimationClass(), isAnimating };
};
