
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { products } from "@/data/products";
import { Product } from "@/types";
import SearchBar from "@/components/catalog/SearchBar";
import ProductGrid from "@/components/catalog/ProductGrid";

const Accessories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states for accessories
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    priceRange: [0, 50] as [number, number],
  });
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Get only accessories from products
  const accessoryProducts = products.filter(product => product.category === "accessories");

  // Parse search from URL
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [searchParams]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...accessoryProducts];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }

    // Apply price range filter
    result = result.filter(
      product =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (sort) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.ratings - a.ratings);
        break;
      case "name-a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filters, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: filters.search });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      priceRange: [0, 50],
    });
    setSearchParams({});
  };

  const hasActiveFilters = filters.priceRange[0] > 0 || filters.priceRange[1] < 50;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Eyewear Accessories</h1>
        <p className="text-muted-foreground text-lg">
          Complete your eyewear experience with our premium accessories collection. 
          From cleaning kits to stylish chains, we have everything you need to care for and enhance your glasses.
        </p>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Cleaning & Care</h3>
          <p className="text-sm text-muted-foreground">Keep your lenses crystal clear with our professional cleaning solutions</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Repair & Maintenance</h3>
          <p className="text-sm text-muted-foreground">Emergency repair kits and replacement parts for your eyewear</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Storage & Style</h3>
          <p className="text-sm text-muted-foreground">Protect and organize your glasses with stylish holders and chains</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
        <SearchBar 
          searchTerm={filters.search}
          onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
          onSearch={handleSearch}
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Select value={sort} onValueChange={setSort}>
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

      {/* Product Grid */}
      <ProductGrid 
        products={filteredProducts}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default Accessories;
