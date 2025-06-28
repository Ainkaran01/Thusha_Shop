import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { sortProducts } from "@/utils/productUtils";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import ProductFilters from "@/components/catalog/ProductFilters";
import ProductGrid from "@/components/catalog/ProductGrid";
import EyeglassRecommendations from "@/components/catalog/EyeglassRecommendations";
import CatalogHeader from "@/components/catalog/CatalogHeader";
import { Product } from "@/types/product";

const Catalog: React.FC = () => {
  const { user } = useUser();
  const {
    filters,
    filteredProducts,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    setSearchParams,
    isLoading,
    error
  } = useCatalogFilters();
  
  const [sort, setSort] = useState<string>("featured");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const sortedProducts = sortProducts(filteredProducts, sort);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.search.trim()) {
      setSearchParams({ search: filters.search.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchChange = (value: string) => {
    handleFilterChange('search', value);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CatalogHeader
        searchTerm={filters.search}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        sort={sort}
        onSortChange={setSort}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        resultsCount={sortedProducts.length}
      />

      {/* Only show recommendations if we have user data */}
      {user?.preferences && (
        <EyeglassRecommendations 
          userFaceShape={user.preferences.faceShape}
          userVisionProblems={user.preferences.visionProblem ? [user.preferences.visionProblem] : []}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Filters Sidebar - hidden on mobile when showFilters is false */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
          <ProductFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            showFilters={showFilters}
            onCloseFilters={() => setShowFilters(false)}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <ProductGrid 
              products={sortedProducts}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;