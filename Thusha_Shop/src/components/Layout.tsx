
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAnimation, AnimationVariant } from "@/hooks/use-animation";

const Layout = () => {
  // Animation for the main content
  const { ref, className } = useAnimation({
    variant: 'fade-in' as AnimationVariant,
    duration: 600,
    once: true
  });

  // Add scroll reveal effect for elements with the 'reveal' class
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          revealElements[i].classList.add('active');
        }
      }
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  // Add "back to top" button that appears when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const backToTopBtn = document.getElementById('back-to-top');
      if (backToTopBtn) {
        if (window.scrollY > 300) {
          backToTopBtn.classList.remove('opacity-0', 'invisible');
          backToTopBtn.classList.add('opacity-100', 'visible');
        } else {
          backToTopBtn.classList.remove('opacity-100', 'visible');
          backToTopBtn.classList.add('opacity-0', 'invisible');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main ref={ref} className={`flex-grow ${className}`}>
        <Outlet />
        
        {/* Back to top button */}
        <button 
          id="back-to-top"
          onClick={scrollToTop} 
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 invisible hover:bg-accent transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
