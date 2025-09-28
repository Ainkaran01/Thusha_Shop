import React from 'react';
import ProductViewer360 from '@/components/ProductViewer360';
import { getOptimal360Frames } from '@/utils/360EffectUtils';

const Product360Demo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">360° Product Viewer Demo</h1>
      
      <div className="max-w-4xl mx-auto">
        {/* Single Eyeglasses 360° View */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Premium Eyeglasses 360° View</h2>
          <ProductViewer360
            images={getOptimal360Frames([
              "/images/f1.jpg",
              "/images/f2.jpg", 
              "/images/f3.jpg",
              "/images/f4.jpg"
            ], 32)}
            productName="Premium Eyeglasses"
            fallbackImage="/images/f1.jpg"
            className="mx-auto"
          />
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4">Features:</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Drag right → see right side view</li>
          <li>• Drag left → see left side view</li>
          <li>• Click Auto button to start rotation</li>
          <li>• Fullscreen mode</li>
          <li>• Mobile touch support</li>
          <li>• Thumbnail navigation</li>
        </ul>
      </div>
    </div>
  );
};

export default Product360Demo;
