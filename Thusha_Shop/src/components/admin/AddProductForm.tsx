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
import { addProduct } from "@/api/products";
import { useAdminDashboard } from "@/context/AdminDashboardContext";

interface AddProductFormProps {
  onCancel: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  frameType: string;
  frame_material: string;
  colors: string;
  size: string;
  weight: string;
  features: string[];
  recommendedFaceShapes: string[];
  recommendedVisionProblems: string[];
  // image: string;
  images: string[];
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

const AddProductForm: React.FC<AddProductFormProps> = ({ onCancel }) => {
  const {
    addProduct: addToContext,
    categories,
    frameTypes,
    refreshProducts,
  } = useAdminDashboard();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    frameType: "",
    frame_material: "",
    colors: "",
    size: "",
    weight: "",
    images: [],
    features: [],
    recommendedFaceShapes: [],
    recommendedVisionProblems: [],
  });

  const selectedCategoryName = categories.find(
  (cat) => cat.id.toString() === formData.category
  )?.name || "";

  const isAccessoryCategory = () => {
  const normalized = selectedCategoryName.trim().toLowerCase();
  return ["accessory", "accessories"].includes(normalized);
  };
  
  const [images, setImages] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 5) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 5 images",
          variant: "destructive",
        });
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleArrayToggle = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     setImage(e.target.files[0]);
  //   }
  // };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one product image is required",
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

      images.forEach((image) => {
      formDataToSend.append('images', image);  // Note: same field name for all images
      });

      if (formData.frameType) {
      formDataToSend.append("frame_type_id", formData.frameType);
    } else {
      formDataToSend.append("frame_type_id", ""); // Explicit empty
    }

      if (formData.size) {
        formDataToSend.append("size", formData.size);
      }

      if (formData.weight) {
        formDataToSend.append("weight", formData.weight);
      }

      // if (image) {
      //   formDataToSend.append("image", image);
      // }

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

      if (formData.recommendedFaceShapes.length > 0) {
        formDataToSend.append(
          "face_shapes",
          JSON.stringify(formData.recommendedFaceShapes)
        );
      }

      if (formData.recommendedVisionProblems.length > 0) {
        formDataToSend.append(
          "vision_problems",
          JSON.stringify(formData.recommendedVisionProblems)
        );
      }

      const newProduct = await addProduct(formDataToSend);
      await refreshProducts();

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      onCancel();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Enter the details for the new product</CardDescription>
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
              <Label htmlFor="stock">Initial Stock *</Label>
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
            {!isAccessoryCategory() && (
            <div className="space-y-2">
              <Label htmlFor="frameType">Frame Type</Label>
              <Select
                value={formData.frameType}
                onValueChange={(value) => handleInputChange("frameType", value)}
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
            )}

            {!isAccessoryCategory() && (
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
            )}

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
              type="number"
              placeholder="e.g., 18"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>

          {/* Features */}
          {!isAccessoryCategory() && (
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
          )}

          {/* Recommendations */}
          {!isAccessoryCategory() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Recommended Face Shapes</Label>
              <div className="grid grid-cols-2 gap-2">
                {faceShapes.map((shape) => (
                  <div key={shape} className="flex items-center space-x-2">
                    <Checkbox
                      id={`face-${shape}`}
                      checked={formData.recommendedFaceShapes.includes(shape)}
                      onCheckedChange={() =>
                        handleArrayToggle("recommendedFaceShapes", shape)
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
                      checked={formData.recommendedVisionProblems.includes(
                        problem
                      )}
                      onCheckedChange={() =>
                        handleArrayToggle("recommendedVisionProblems", problem)
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
          )}

          {/* Image Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Product Images *</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Upload multiple images (minimum 1, maximum 5)
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-8 gap-2 h-30">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                    <p className="text-xs truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddProductForm;


