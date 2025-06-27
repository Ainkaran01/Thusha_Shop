
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { sortProducts } from "@/utils/productUtils";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import ProductFilters from "@/components/catalog/ProductFilters";
import ProductGrid from "@/components/catalog/ProductGrid";
// import EyeglassRecommendations from "@/components/catalog/EyeglassRecommendations";
import CatalogHeader from "@/components/catalog/CatalogHeader";

const Catalog = () => {
  const {
    filters,
    filteredProducts,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    setSearchParams
  } = useCatalogFilters();
  
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const sortedProducts = sortProducts(filteredProducts, sort);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: filters.search });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CatalogHeader
        searchTerm={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        onSearch={handleSearch}
        sort={sort}
        onSortChange={setSort}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        resultsCount={sortedProducts.length}
      />

      {/* Recommendations */}
      {/* <EyeglassRecommendations 
        userFaceShape={user?.preferences?.faceShape}
        userVisionProblems={user?.preferences?.visionProblem ? [user.preferences.visionProblem] : []}
      /> */}

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Filters Sidebar */}
        <ProductFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          onCloseFilters={() => setShowFilters(false)}
        />

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid 
            products={sortedProducts}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default Catalog;
