import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/types/product";
import { useUser } from "@/context/UserContext";


export interface CatalogFilters {
  search: string;
  faceShape: string[];
  frameType: string[];
  frameMaterial: string[];
  priceRange: [number, number];
  visionProblem: string[];
  category: string[];
}

const API_BASE_URL = "http://localhost:8000/api";

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();
  const initialFaceShape = searchParams.get("faceShape");

  const [filters, setFilters] = useState<CatalogFilters>({
    search: searchParams.get("search") || "",
    faceShape: initialFaceShape ? [initialFaceShape] : [],
    frameType: [],
    frameMaterial: [],
    priceRange: [0, 20000],
    visionProblem: [],
    category: [],
  });

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Django backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);


  // Initialize face shape filter if user has a known face shape
  useEffect(() => {
    if (
      user?.preferences?.faceShape &&
      user.preferences.faceShape !== "unknown"
    ) {
      setFilters((prev) => ({
        ...prev,
        faceShape: [user.preferences.faceShape],
      }));
    }
  }, [user]);

  // Parse search from URL
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
    }
  }, [searchParams]);

  // Apply filters to the fetched products
  useEffect(() => {
    if (isLoading) return;

    let result = [...allProducts];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.frame_type.name &&
            product.frame_type.name.toLowerCase().includes(searchTerm)) ||
          (product.frame_material &&
            product.frame_material.toLowerCase().includes(searchTerm)) ||
          (product.category.name &&
            product.category.name.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (filters.category.length > 0) {
      result = result.filter(
        (product) =>
          product.category && filters.category.includes(product.category?.name)
      );
    }

    // Apply face shape filter
    if (filters.faceShape.length > 0) {
      result = result.filter(
        (product) =>
          product.face_shapes &&
          filters.faceShape.some((shape) => product.face_shapes.includes(shape))
      );
    }

    // Apply frame type filter
    if (filters.frameType.length > 0) {
      result = result.filter(
        (product) =>
          product.frame_type &&
          filters.frameType.includes(product.frame_type?.name)
      );
    }

    // Apply frame material filter
    if (filters.frameMaterial.length > 0) {
      result = result.filter(
        (product) =>
          product.frame_material &&
          filters.frameMaterial.includes(product.frame_material)
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply vision problem filter
    if (filters.visionProblem.length > 0) {
      result = result.filter(
        (product) =>
          product.vision_problems &&
          filters.visionProblem.some((problem) =>
            product.vision_problems.includes(problem)
          )
      );
    }

    setFilteredProducts(result);
  }, [filters, allProducts, isLoading]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => {
      if (filterType === "priceRange") {
        return { ...prev, priceRange: value };
      }

      if (value === null) {
        return { ...prev, [filterType]: [] };
      }

      // For checkboxes - toggle the value
      if (Array.isArray(prev[filterType as keyof CatalogFilters])) {
        const currentValues = prev[
          filterType as keyof CatalogFilters
        ] as string[];
        return {
          ...prev,
          [filterType]: currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value],
        };
      }

      return { ...prev, [filterType]: [value] };
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      faceShape: [],
      frameType: [],
      frameMaterial: [],
      priceRange: [0, 20000],
      visionProblem: [],
      category: [],
    });
    setSearchParams({});

    setFilteredProducts(allProducts); // restore all products
  };

  const hasActiveFilters =
    filters.faceShape.length > 0 ||
    filters.frameType.length > 0 ||
    filters.frameMaterial.length > 0 ||
    filters.visionProblem.length > 0 ||
    filters.category.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 20000;

  return {
    filters,
    filteredProducts,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    setSearchParams,
    isLoading,
    error,
  };
};


