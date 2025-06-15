
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import SearchBar from "./SearchBar";

interface CatalogHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  sort: string;
  onSortChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  resultsCount: number;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  sort,
  onSortChange,
  showFilters,
  onToggleFilters,
  resultsCount,
}) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Eyewear Collection</h1>
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onToggleFilters}
            className="sm:hidden flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name-a-z">Name: A to Z</SelectItem>
              <SelectItem value="name-z-a">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-muted-foreground">
        Showing {resultsCount} results
      </p>
    </div>
  );
};

export default CatalogHeader;
