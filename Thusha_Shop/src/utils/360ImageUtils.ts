/**
 * Utility functions for managing 360-degree product images
 */

export interface Image360Config {
  frameCount: number;
  frameInterval: number; // degrees between frames
  autoRotateSpeed: number; // milliseconds between frames
  defaultZoom: number;
  thumbnailSize: number;
}

export const DEFAULT_360_CONFIG: Image360Config = {
  frameCount: 36,
  frameInterval: 10, // 10 degrees per frame
  autoRotateSpeed: 150,
  defaultZoom: 1,
  thumbnailSize: 64
};

/**
 * Generate 360-degree image URLs for a product
 * @param productId - The product ID
 * @param imageSet - The image set identifier (e.g., 'glasses1', 'glasses2')
 * @param frameCount - Number of frames (default: 36)
 * @returns Array of image URLs
 */
export function generate360ImageUrls(
  productId: number,
  imageSet: string,
  frameCount: number = 36
): string[] {
  const urls: string[] = [];
  
  for (let i = 1; i <= frameCount; i++) {
    const frameNumber = i.toString().padStart(3, '0');
    urls.push(`/images/360/${imageSet}/frame_${frameNumber}.jpg`);
  }
  
  return urls;
}

/**
 * Get frame index from rotation angle
 * @param angle - Rotation angle in degrees (0-360)
 * @param frameCount - Total number of frames
 * @returns Frame index (0-based)
 */
export function getFrameIndexFromAngle(angle: number, frameCount: number = 36): number {
  const normalizedAngle = ((angle % 360) + 360) % 360; // Ensure positive angle
  const frameIndex = Math.round((normalizedAngle / 360) * frameCount);
  return frameIndex % frameCount;
}

/**
 * Get rotation angle from frame index
 * @param frameIndex - Frame index (0-based)
 * @param frameCount - Total number of frames
 * @returns Rotation angle in degrees
 */
export function getAngleFromFrameIndex(frameIndex: number, frameCount: number = 36): number {
  return (frameIndex / frameCount) * 360;
}

/**
 * Check if a product has 360-degree images available
 * @param productId - The product ID
 * @returns Promise that resolves to boolean
 */
export async function check360ImagesAvailable(productId: number): Promise<boolean> {
  try {
    // In a real implementation, this would check your API or file system
    // For demo purposes, we'll simulate checking if images exist
    const testImageUrl = `/images/360/glasses${(productId % 2) + 1}/frame_001.jpg`;
    
    const response = await fetch(testImageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Preload 360-degree images for better performance
 * @param imageUrls - Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded
 */
export function preload360Images(imageUrls: string[]): Promise<void[]> {
  const loadPromises = imageUrls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });
  
  return Promise.all(loadPromises);
}

/**
 * Generate thumbnail URLs for 360-degree images
 * @param baseImageUrls - Array of base image URLs
 * @param thumbnailSize - Size of thumbnails (default: 64px)
 * @returns Array of thumbnail URLs
 */
export function generateThumbnailUrls(
  baseImageUrls: string[],
  thumbnailSize: number = 64
): string[] {
  return baseImageUrls.map(url => {
    // In a real implementation, you might use a CDN or image processing service
    // For now, we'll return the same URLs
    return url.replace('/images/', `/images/thumbnails/${thumbnailSize}x${thumbnailSize}/`);
  });
}

/**
 * Calculate optimal frame rate for smooth rotation
 * @param frameCount - Number of frames
 * @param targetDuration - Target duration for full rotation in milliseconds
 * @returns Frame interval in milliseconds
 */
export function calculateOptimalFrameRate(frameCount: number, targetDuration: number = 3000): number {
  return Math.round(targetDuration / frameCount);
}

/**
 * Validate 360-degree image configuration
 * @param config - Image configuration
 * @returns Validation result with errors if any
 */
export function validate360Config(config: Image360Config): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.frameCount < 12) {
    errors.push('Frame count should be at least 12 for smooth rotation');
  }
  
  if (config.frameInterval < 5 || config.frameInterval > 30) {
    errors.push('Frame interval should be between 5 and 30 degrees');
  }
  
  if (config.autoRotateSpeed < 50 || config.autoRotateSpeed > 500) {
    errors.push('Auto-rotate speed should be between 50 and 500 milliseconds');
  }
  
  if (config.defaultZoom < 0.5 || config.defaultZoom > 3) {
    errors.push('Default zoom should be between 0.5 and 3');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
