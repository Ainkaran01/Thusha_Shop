
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface AddProductFormProps {
  onAddProduct: (product: {
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    frameType: string;
    frameMaterial: string;
    color: string;
    size: string;
    weight: string;
    features: string[];
    recommendedFaceShapes: string[];
    recommendedVisionProblems: string[];
  }) => void;
  onCancel: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    frameType: "",
    frameMaterial: "",
    color: "",
    size: "",
    weight: "",
    features: [] as string[],
    recommendedFaceShapes: [] as string[],
    recommendedVisionProblems: [] as string[],
  });
  
  const { toast } = useToast();

  const categories = [
    { value: "eyeglasses", label: "Eyeglasses" },
    { value: "sunglasses", label: "Sunglasses" },
    { value: "computer-glasses", label: "Computer Glasses" },
    { value: "reading-glasses", label: "Reading Glasses" },
    { value: "safety-glasses", label: "Safety Glasses" },
    { value: "accessories", label: "Accessories" }
  ];

  const frameTypes = ["aviator", "square", "round", "cat-eye", "rectangular", "oval", "wraparound", "oversized", "accessory"];
  const frameMaterials = ["metal", "acetate", "titanium", "plastic", "wood", "TR90", "polycarbonate", "various"];
  const faceShapes = ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"];
  const visionProblems = ["nearsighted", "farsighted", "astigmatism", "presbyopia"];
  const commonFeatures = [
    "UV400 Protection", "Polarized Lenses", "Blue Light Filter", "Anti-Glare Coating",
    "Lightweight Design", "Spring Hinges", "Adjustable Nose Pads", "Impact Resistant",
    "Scratch Resistant", "Anti-Fog", "Washable", "Portable Case"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    const numericPrice = parseFloat(formData.price);
    const numericStock = parseInt(formData.stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(numericStock) || numericStock < 0) {
      toast({
        title: "Invalid Stock",
        description: "Please enter a valid stock quantity.",
        variant: "destructive",
      });
      return;
    }

    onAddProduct({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: numericPrice,
      stock: numericStock,
      frameType: formData.frameType || "rectangular",
      frameMaterial: formData.frameMaterial || "plastic",
      color: formData.color || "black",
      size: formData.size || "Standard",
      weight: formData.weight || "20g",
      features: formData.features,
      recommendedFaceShapes: formData.recommendedFaceShapes,
      recommendedVisionProblems: formData.recommendedVisionProblems,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      frameType: "",
      frameMaterial: "",
      color: "",
      size: "",
      weight: "",
      features: [],
      recommendedFaceShapes: [],
      recommendedVisionProblems: [],
    });
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
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
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
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
              />
            </div>
          </div>

          {/* Physical Properties */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frameType">Frame Type</Label>
              <Select value={formData.frameType} onValueChange={(value) => handleInputChange("frameType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {frameTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frameMaterial">Material</Label>
              <Select value={formData.frameMaterial} onValueChange={(value) => handleInputChange("frameMaterial", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {frameMaterials.map(material => (
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
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
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
            <Label htmlFor="weight">Weight</Label>
            <Input 
              id="weight" 
              placeholder="e.g., 18g"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonFeatures.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => handleArrayToggle("features", feature)}
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
                {faceShapes.map(shape => (
                  <div key={shape} className="flex items-center space-x-2">
                    <Checkbox
                      id={`face-${shape}`}
                      checked={formData.recommendedFaceShapes.includes(shape)}
                      onCheckedChange={() => handleArrayToggle("recommendedFaceShapes", shape)}
                    />
                    <Label htmlFor={`face-${shape}`} className="text-sm capitalize">
                      {shape}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recommended for Vision Problems</Label>
              <div className="grid grid-cols-1 gap-2">
                {visionProblems.map(problem => (
                  <div key={problem} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vision-${problem}`}
                      checked={formData.recommendedVisionProblems.includes(problem)}
                      onCheckedChange={() => handleArrayToggle("recommendedVisionProblems", problem)}
                    />
                    <Label htmlFor={`vision-${problem}`} className="text-sm capitalize">
                      {problem}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Product</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddProductForm;
