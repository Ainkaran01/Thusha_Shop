import React, { useState } from 'react';
import { Sun, LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { forwardRef } from 'react';

// Light mode brightness levels
const BrightnessLevels = {
  BRIGHT: 'bright',
  MEDIUM: 'medium',
  SOFT: 'soft'
};

type BrightnessLevel = typeof BrightnessLevels[keyof typeof BrightnessLevels];

// Custom icon for medium brightness - using forwardRef to match LucideIcon requirements
const MediumBrightness = forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<"svg">>((props, ref) => (
  <svg 
    ref={ref}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m17.5 6.5-1.5 1.5"></path>
    <path d="m6.5 17.5 1.5-1.5"></path>
  </svg>
));
MediumBrightness.displayName = 'MediumBrightness';

// Custom icon for soft brightness - using forwardRef to match LucideIcon requirements
const SoftBrightness = forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<"svg">>((props, ref) => (
  <svg 
    ref={ref}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="5"></circle>
    <path d="M12 3v1"></path>
    <path d="M12 20v1"></path>
    <path d="M3 12h1"></path>
    <path d="M20 12h1"></path>
  </svg>
));
SoftBrightness.displayName = 'SoftBrightness';

export function ThemeToggle() {
  return null;
}
