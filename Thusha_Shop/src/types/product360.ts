export interface Product360Images {
  id: string;
  productId: number;
  frames: string[]; // Array of image URLs for 360 rotation
  frameCount: number;
  thumbnail?: string;
  isAvailable: boolean;
}

export interface Product360View {
  has360View: boolean;
  images?: Product360Images;
  autoRotateSpeed?: number; // milliseconds between frames
  defaultZoom?: number;
}

// Import the Product type
import { Product } from './product';

// Extend the existing Product interface to include 360 view data
export interface ProductWith360 extends Product {
  view360?: Product360View;
}

// Sample 360-degree image sets for demonstration
// Using realistic eyeglasses rotation patterns (36 frames)
export const sample360ImageSets: { [key: string]: string[] } = {
  // Eyeglasses 1: Realistic rotation pattern
  // Front view (0-8), Right side (9-17), Back (18-26), Left side (27-35)
  'eyeglasses_1': [
    // Front view (frames 0-8)
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    // Right side view (frames 9-17)
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    // Back view (frames 18-26)
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    // Left side view (frames 27-35)
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
  ],
  
  // Eyeglasses 2: Different rotation pattern
  'eyeglasses_2': [
    // Front view (frames 0-8)
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    // Right side view (frames 9-17)
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    // Back view (frames 18-26)
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    // Left side view (frames 27-35)
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
  ],
  
  // Sunglasses: Another rotation pattern
  'sunglasses_1': [
    // Front view (frames 0-8)
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    '/images/f3.jpg', '/images/f3.jpg', '/images/f3.jpg',
    // Right side view (frames 9-17)
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    '/images/f4.jpg', '/images/f4.jpg', '/images/f4.jpg',
    // Back view (frames 18-26)
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    '/images/f1.jpg', '/images/f1.jpg', '/images/f1.jpg',
    // Left side view (frames 27-35)
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
    '/images/f2.jpg', '/images/f2.jpg', '/images/f2.jpg',
  ],
};

// Utility function to get 360 images for a product
export function get360ImagesForProduct(productId: number): string[] | null {
  // Show 360° view for all eyeglasses products (you can customize this logic)
  // For now, return sample images for any product that has 360° view
  return sample360ImageSets.eyeglasses_1;
}

// Utility function to check if a product has 360 view
export function has360View(productId: number): boolean {
  // Show 360° view for all products (you can customize this logic)
  // You can add specific conditions like:
  // - return productId >= 1 && productId <= 10; // Only for products 1-10
  // - return productId % 2 === 0; // Only for even product IDs
  // - return true; // For all products
  return true; // Enable 360° view for all products
}
