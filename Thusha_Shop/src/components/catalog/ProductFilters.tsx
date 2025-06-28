
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getFrameTypes } from '@/api/frameTypes';
import { getCategories } from '@/api/categories';

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
  const [frameTypes, setFrameTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const frameMaterials = ["metal", "acetate", "titanium", "plastic", "wood", "TR90", "polycarbonate"];

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        // Fetch frame types
        const frameTypesData = await getFrameTypes();
        const frameTypeNames = frameTypesData.map(ft => ft.name);
        setFrameTypes(frameTypeNames);

        // Fetch categories
        const categoriesData = await getCategories();
        const categoryNames = categoriesData.map(c => c.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const toggleFilter = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
  };

  if (isLoading) {
    return (
      <div className="w-full sm:w-64 bg-background p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            defaultValue={[0,20000]}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={(values) => onFilterChange('priceRange', [values[0], values[1]])}
            min={0}
            max={20000}
            step={100}
            className="mb-6"
          />
          <div className="flex justify-between">
            <span>LKR {filters.priceRange[0]}</span>
            <span>LKR {filters.priceRange[1]}</span>
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