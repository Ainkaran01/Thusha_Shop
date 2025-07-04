import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { updateProduct } from "@/api/products";
import { useAdminDashboard } from "@/context/AdminDashboardContext";

interface EditProductFormProps {
  product: {
    id: number;
    name: string;
    description: string;
    category: { id: number; name: string };
    price: number;
    stock?: number;
    frame_type?: { id: number; name: string };
    frame_material?: string;
    colors?: string;
    size?: string;
    weight: number;
    features?: string[];
    face_shapes?: string[];
    vision_problems?: string[];
    images?: string[];
  };
  onCancel: () => void;
  onSuccess: () => void;
}

const frameMaterials = [
  "metal",
  "acetate",
  "titanium",
  "plastic",
  "wood",
  "TR90",
  "polycarbonate",
  "various",
];
const faceShapes = [
  "oval",
  "round",
  "square",
  "heart",
  "diamond",
  "triangle",
  "oblong",
];
const visionProblems = [
  "nearsighted",
  "farsighted",
  "astigmatism",
  "presbyopia",
];
const commonFeatures = [
  "UV400 Protection",
  "Polarized Lenses",
  "Blue Light Filter",
  "Anti-Glare Coating",
  "Lightweight Design",
  "Spring Hinges",
  "Adjustable Nose Pads",
  "Impact Resistant",
  "Scratch Resistant",
  "Anti-Fog",
  "Washable",
  "Portable Case",
];

const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onCancel,
  onSuccess,
}) => {
  const { categories, frameTypes, refreshProducts } = useAdminDashboard();

  const safeParseArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  console.log("INCOMING PRODUCT DATA:", {
    ...product,
    features: product.features,
    face_shapes: product.face_shapes,
    vision_problems: product.vision_problems,
    colors: product.colors,
  });

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    category: product.category.id.toString(),
    price: product.price.toString(),
    stock: product.stock.toString(),
    frame_type: product.frame_type?.id.toString() || "",
    frame_material: product.frame_material || "",
    colors: product.colors
      ? Array.isArray(product.colors)
        ? product.colors.join(", ")
        : typeof product.colors === "string"
        ? product.colors
        : ""
      : "",
    size: product.size || "",
    weight: product.weight.toString(),
    features: safeParseArray(product.features),
    face_shapes: safeParseArray(product.face_shapes),
    vision_problems: safeParseArray(product.vision_problems),
  });

  const [images, setImages] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>(
    product.images || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const MEDIA_URL = "http://localhost:8000/media/";
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);

      // Create preview URLs for new images
      const newImageUrls = newImages.map((file) => URL.createObjectURL(file));
      setCurrentImages((prev) => [...prev, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
    // If it's a newly added image (not from server), remove from images array
    if (index >= (product.images?.length || 0)) {
      setImages((prev) =>
        prev.filter((_, i) => i !== index - (product.images?.length || 0))
      );
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive",
      });
      return false;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price)) {
      toast({
        title: "Validation Error",
        description: "Price must be a valid number",
        variant: "destructive",
      });
      return false;
    }

    const stock = parseInt(formData.stock);
    if (isNaN(stock)) {
      toast({
        title: "Validation Error",
        description: "Stock must be a valid integer",
        variant: "destructive",
      });
      return false;
    }

    const weight = parseFloat(formData.weight);
    if (isNaN(weight)) {
      toast({
        title: "Validation Error",
        description: "Weight must be a valid integer or float",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category_id", formData.category);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);

      if (formData.frame_type) {
      formDataToSend.append("frame_type_id", formData.frame_type);
    } else {
      formDataToSend.append("frame_type_id", "");
    }

      if (formData.size) {
        formDataToSend.append("size", formData.size);
      }

      if (formData.weight) {
        formDataToSend.append("weight", formData.weight);
      }

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      if (formData.frame_material) {
        formDataToSend.append("frame_material", formData.frame_material);
      }

      if (formData.colors) {
        formDataToSend.append(
          "colors",
          JSON.stringify(formData.colors.split(",").map((c) => c.trim()))
        );
      }

      if (formData.features.length > 0) {
        formDataToSend.append("features", JSON.stringify(formData.features));
      }

      if (formData.face_shapes.length > 0) {
        formDataToSend.append(
          "face_shapes",
          JSON.stringify(formData.face_shapes)
        );
      }

      if (formData.vision_problems.length > 0) {
        formDataToSend.append(
          "vision_problems",
          JSON.stringify(formData.vision_problems)
        );
      }

      const existingImagePaths = currentImages
        .filter((img) => !img.startsWith("blob:"))
        .map((img) => img.replace(MEDIA_URL, ""));
      formDataToSend.append(
        "existing_images",
        JSON.stringify(existingImagePaths)
      );

      await updateProduct(product.id, formDataToSend);
      await refreshProducts();

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>Update the details for this product</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Pricing and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Physical Properties */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frameType">Frame Type</Label>
              <Select
                value={formData.frame_type}
                onValueChange={(value) =>
                  handleInputChange("frame_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {frameTypes.map((frameType) => (
                    <SelectItem
                      key={frameType.id}
                      value={frameType.id.toString()}
                    >
                      {frameType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frameMaterial">Material</Label>
              <Select
                value={formData.frame_material}
                onValueChange={(value) =>
                  handleInputChange("frame_material", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {frameMaterials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material.charAt(0).toUpperCase() + material.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="e.g., Black, Gold"
                value={formData.colors}
                onChange={(e) => handleInputChange("colors", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                placeholder="e.g., 52-18-145"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (grams)</Label>
            <Input
              id="weight"
              placeholder="e.g., 18"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() =>
                      handleArrayToggle("features", feature)
                    }
                  />
                  <Label htmlFor={`feature-${feature}`} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Recommended Face Shapes</Label>
              <div className="grid grid-cols-2 gap-2">
                {faceShapes.map((shape) => (
                  <div key={shape} className="flex items-center space-x-2">
                    <Checkbox
                      id={`face-${shape}`}
                      checked={formData.face_shapes.includes(shape)}
                      onCheckedChange={() =>
                        handleArrayToggle("face_shapes", shape)
                      }
                    />
                    <Label
                      htmlFor={`face-${shape}`}
                      className="text-sm capitalize"
                    >
                      {shape}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recommended for Vision Problems</Label>
              <div className="grid grid-cols-1 gap-2">
                {visionProblems.map((problem) => (
                  <div key={problem} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vision-${problem}`}
                      checked={formData.vision_problems.includes(problem)}
                      onCheckedChange={() =>
                        handleArrayToggle("vision_problems", problem)
                      }
                    />
                    <Label
                      htmlFor={`vision-${problem}`}
                      className="text-sm capitalize"
                    >
                      {problem}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload - Updated for multiple images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex flex-wrap gap-4 mb-4">
              {currentImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={
                      imageUrl.startsWith("blob:") ||
                      imageUrl.startsWith("http")
                        ? imageUrl
                        : `${MEDIA_URL}${imageUrl}`
                    }
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <p className="text-sm text-muted-foreground">
              Upload multiple images (minimum 1, maximum 10)
            </p>
          </div>

          {/* Rest of your form remains the same */}
          {/* ... [Keep all your existing form fields] ... */}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditProductForm;
