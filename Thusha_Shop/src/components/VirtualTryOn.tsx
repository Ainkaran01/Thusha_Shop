
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Camera, RotateCcw } from 'lucide-react';
import { Product } from '@/types';

interface VirtualTryOnProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [isLoading, setIsLoading] = useState(false);

  const colors = ['black', 'brown', 'gold', 'silver', 'blue', 'red', 'green'];

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Simple frame overlay (this would be enhanced with face detection in a real app)
        ctx.fillStyle = selectedColor;
        ctx.fillRect(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.6, 20);
        ctx.fillRect(canvas.width * 0.2, canvas.height * 0.3, 20, canvas.height * 0.2);
        ctx.fillRect(canvas.width * 0.6, canvas.height * 0.3, 20, canvas.height * 0.2);
        
        // Download the image
        const link = document.createElement('a');
        link.download = `virtual-tryom-${product.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Virtual Try-On - {product.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Starting camera...</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-96 object-cover"
                />
                {/* Simple frame overlay */}
                <div 
                  className="absolute top-1/3 left-1/5 w-3/5 border-4 rounded-lg opacity-70"
                  style={{ 
                    borderColor: selectedColor,
                    height: '20%',
                    background: `${selectedColor}20`
                  }}
                >
                  <div className="text-center text-white text-sm mt-2 font-semibold">
                    {product.name}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <h4 className="font-medium mb-2">Frame Color:</h4>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-primary scale-110' : 'border-gray-300'
                  } transition-all`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <Badge variant="outline" className="mt-2 capitalize">
              Current: {selectedColor}
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button onClick={capturePhoto} disabled={!stream || isLoading}>
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
            <Button variant="outline" onClick={startCamera} disabled={isLoading}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Camera
            </Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualTryOn;