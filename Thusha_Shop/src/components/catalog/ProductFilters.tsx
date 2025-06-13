
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  filters: {
    faceShape: string[];
    frameType: string[];
    frameMaterial: string[];
    priceRange: [number, number];
    visionProblem: string[];
    category?: string[];
  };
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onCloseFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  onCloseFilters,
}) => {
  const frameTypes = ["aviator", "square", "round", "cat-eye", "rectangular", "oval", "wraparound", "oversized"];
  const frameMaterials = ["metal", "acetate", "titanium", "plastic", "wood", "TR90", "polycarbonate"];
  const categories = ["eyeglasses", "sunglasses", "computer-glasses", "reading-glasses", "safety-glasses", "accessories"];

  const toggleFilter = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
  };

  return (
    <div 
      className={`w-full sm:w-64 bg-background p-6 rounded-lg shadow-md transition-all duration-300 ${
        showFilters ? "block" : "hidden sm:block"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <Checkbox 
                id={`category-${category}`} 
                checked={filters.category?.includes(category) || false}
                onCheckedChange={() => toggleFilter('category', category)}
              />
              <Label htmlFor={`category-${category}`} className="ml-2 capitalize">
                {category.replace('-', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Face Shape Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Face Shape</h3>
        <div className="space-y-2">
          {["oval", "round", "square", "heart", "diamond", "triangle", "oblong"].map(shape => (
            <div key={shape} className="flex items-center">
              <Checkbox 
                id={`face-${shape}`} 
                checked={filters.faceShape.includes(shape)}
                onCheckedChange={() => toggleFilter('faceShape', shape)}
              />
              <Label htmlFor={`face-${shape}`} className="ml-2 capitalize">
                {shape}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Frame Type Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Frame Type</h3>
        <div className="space-y-2">
          {frameTypes.map(type => (
            <div key={type} className="flex items-center">
              <Checkbox 
                id={`type-${type}`} 
                checked={filters.frameType.includes(type)}
                onCheckedChange={() => toggleFilter('frameType', type)}
              />
              <Label htmlFor={`type-${type}`} className="ml-2 capitalize">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Frame Material Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Frame Material</h3>
        <div className="space-y-2">
          {frameMaterials.map(material => (
            <div key={material} className="flex items-center">
              <Checkbox 
                id={`material-${material}`} 
                checked={filters.frameMaterial.includes(material)}
                onCheckedChange={() => toggleFilter('frameMaterial', material)}
              />
              <Label htmlFor={`material-${material}`} className="ml-2 capitalize">
                {material}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 200]}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={(values) => onFilterChange('priceRange', [values[0], values[1]])}
            min={0}
            max={200}
            step={10}
            className="mb-6"
          />
          <div className="flex justify-between">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Vision Problem Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Vision Problem</h3>
        <div className="space-y-2">
          {["nearsighted", "farsighted", "astigmatism", "presbyopia"].map(problem => (
            <div key={problem} className="flex items-center">
              <Checkbox 
                id={`vision-${problem}`} 
                checked={filters.visionProblem.includes(problem)}
                onCheckedChange={() => toggleFilter('visionProblem', problem)}
              />
              <Label htmlFor={`vision-${problem}`} className="ml-2 capitalize">
                {problem}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Close Filters */}
      <div className="mt-6 sm:hidden">
        <Button onClick={onCloseFilters} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
