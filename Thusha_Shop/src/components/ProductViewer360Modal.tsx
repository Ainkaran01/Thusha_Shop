import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, ZoomIn, ZoomOut, RotateCw, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductViewer360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
  fallbackImage?: string;
}

const ProductViewer360Modal: React.FC<ProductViewer360ModalProps> = ({
  isOpen,
  onClose,
  images,
  productName,
  fallbackImage = "/images/f1.jpg"
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, frame: 0 });
  const [rotationDirection, setRotationDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateInterval = useRef<NodeJS.Timeout | null>(null);


  // Auto-rotation effect with optimized performance
  useEffect(() => {
    if (isAutoRotating && images.length > 0) {
      autoRotateInterval.current = setInterval(() => {
        setCurrentFrame(prev => {
          if (rotationDirection === 'clockwise') {
            return (prev + 1) % images.length;
          } else {
            return prev === 0 ? images.length - 1 : prev - 1;
          }
        });
      }, 800); // Very slow, gentle rotation
    } else {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
        autoRotateInterval.current = null;
      }
    }

    return () => {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
    };
  }, [isAutoRotating, images.length, rotationDirection]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentFrame(0);
      setIsAutoRotating(false);
      setZoom(1);
    }
  }, [isOpen]);

  // Handle mouse drag for manual rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, frame: currentFrame });
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || images.length === 0) return;

    const deltaX = e.clientX - dragStart.x;
    const sensitivity = 0.2; // Ultra-smooth control for video-like experience
    const frameDelta = Math.round(deltaX * sensitivity);
    
    let newFrame = dragStart.frame + frameDelta;
    
    // Ensure frame stays within bounds
    while (newFrame < 0) newFrame += images.length;
    while (newFrame >= images.length) newFrame -= images.length;
    
    setCurrentFrame(newFrame);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, frame: currentFrame });
    setIsAutoRotating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || images.length === 0) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const sensitivity = 0.2; // Ultra-smooth control for video-like experience
    const frameDelta = Math.round(deltaX * sensitivity);
    
    let newFrame = dragStart.frame + frameDelta;
    
    while (newFrame < 0) newFrame += images.length;
    while (newFrame >= images.length) newFrame -= images.length;
    
    setCurrentFrame(newFrame);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentFrame(prev => prev === 0 ? images.length - 1 : prev - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentFrame(prev => (prev + 1) % images.length);
          break;
        case ' ':
          e.preventDefault();
          setIsAutoRotating(prev => !prev);
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  const toggleAutoRotate = () => {
    setIsAutoRotating(prev => !prev);
  };

  const toggleRotationDirection = () => {
    setRotationDirection(prev => 
      prev === 'clockwise' ? 'counterclockwise' : 'clockwise'
    );
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const currentImage = images[currentFrame] || fallbackImage;

  // If modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            360° View - {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Controls */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAutoRotate}
                className="flex items-center gap-2"
              >
                {isAutoRotating ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isAutoRotating ? "Pause" : "Auto Rotate"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleRotationDirection}
                className="flex items-center gap-2"
              >
                {rotationDirection === 'clockwise' ? (
                  <RotateCw className="h-4 w-4" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                {rotationDirection === 'clockwise' ? "Clockwise" : "Counter-clockwise"}
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetZoom}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Frame {currentFrame + 1} of {images.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 360° Viewer */}
          <div className="flex-1 relative overflow-hidden bg-gray-50">
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFrame}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: zoom }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.05, ease: "linear" }}
                  className="max-w-full max-h-full"
                >
                  <img
                    src={currentImage}
                    alt={`${productName} - Frame ${currentFrame + 1}`}
                    className="max-w-full max-h-full object-contain select-none"
                    draggable={false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImage;
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
              onClick={() => setCurrentFrame(prev => prev === 0 ? images.length - 1 : prev - 1)}
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
              onClick={() => setCurrentFrame(prev => (prev + 1) % images.length)}
            >
              →
            </Button>
          </div>

          {/* Frame indicator */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Drag to rotate • Use arrow keys • Space to auto-rotate</span>
            </div>
            
            {/* Frame thumbnails */}
            {images.length > 1 && (
              <div className="flex justify-center gap-1 mt-2 overflow-x-auto">
                {images.slice(0, Math.min(20, images.length)).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFrame(index)}
                    className={`w-8 h-8 rounded border-2 overflow-hidden flex-shrink-0 ${
                      index === currentFrame
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Frame ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {images.length > 20 && (
                  <span className="text-xs text-muted-foreground self-center ml-2">
                    +{images.length - 20} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewer360Modal;
