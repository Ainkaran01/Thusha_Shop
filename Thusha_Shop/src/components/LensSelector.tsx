
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, Glasses } from "lucide-react";
import PrescriptionChecker from "./PrescriptionChecker";

interface LensSelectorProps {
  frameId: number;
  onLensSelected: (lensData: any) => void;
}

const LensSelector = ({ frameId, onLensSelected }: LensSelectorProps) => {
  const [step, setStep] = useState<"type" | "options" | "prescription">("type");
  const [selectedType, setSelectedType] = useState<"standard" | "prescription" | null>(null);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const { toast } = useToast();

  const lensOptions = [
    {
      id: 1,
      name: "Basic",
      description: "Standard lenses with no additional features",
      price: 50,
      features: ["Single vision", "Standard plastic", "No coatings"]
    },
    {
      id: 2,
      name: "Anti-Blue Light",
      description: "Lenses with blue light filtering technology",
      price: 95,
      features: ["Single vision", "Blue light filter", "Anti-glare coating"]
    },
    {
      id: 3,
      name: "Premium",
      description: "High-quality lenses with advanced features",
      price: 150,
      features: ["Single vision", "Scratch-resistant", "Anti-glare", "UV protection", "Water-repellent"]
    }
  ];

  const handleTypeSelect = (type: "standard" | "prescription") => {
    setSelectedType(type);
    if (type === "standard") {
      setStep("options");
    } else {
      setStep("prescription");
    }
  };

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    
    toast({
      title: `${option.name} Lenses Selected`,
      description: "Your lens option has been added to the frame.",
    });
    
    onLensSelected({
      lensType: selectedType,
      lensOption: option,
      frameId: frameId,
      prescription: null
    });
  };

  const handlePrescriptionVerified = (prescriptionData: any) => {
    setStep("options");
    
    toast({
      title: "Prescription Verified",
      description: "Now please select your lens options.",
    });
  };

  const handleCancel = () => {
    setStep("type");
    setSelectedType(null);
  };

  return (
    <div className="space-y-6">
      {step === "type" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${selectedType === "standard" ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
            onClick={() => handleTypeSelect("standard")}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-muted/50 p-3 rounded-full">
                  <Glasses className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Standard Lenses</h3>
                  <p className="text-muted-foreground text-sm">
                    Regular lenses without prescription, perfect if you're just looking for stylish frames.
                  </p>
                  <p className="text-sm font-medium text-primary mt-2">
                    Starting at $50
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${selectedType === "prescription" ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
            onClick={() => handleTypeSelect("prescription")}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-muted/50 p-3 rounded-full">
                  <Glasses className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Prescription Lenses</h3>
                  <p className="text-muted-foreground text-sm">
                    Custom lenses made according to your prescription for optimal vision correction.
                  </p>
                  <p className="text-sm font-medium text-primary mt-2">
                    Starting at $95
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "prescription" && (
        <PrescriptionChecker
          onPrescriptionVerified={handlePrescriptionVerified}
          onCancel={handleCancel}
        />
      )}

      {step === "options" && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Select Lens Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lensOptions.map((option) => (
              <Card 
                key={option.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedOption?.id === option.id ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
                onClick={() => handleOptionSelect(option)}
              >
                <CardContent className="p-6 relative">
                  {selectedOption?.id === option.id && (
                    <div className="absolute top-2 right-2 text-primary">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <h4 className="font-medium text-base">{option.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {option.description}
                    </p>
                    <ul className="space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index} className="text-xs flex items-center">
                          <Check className="h-3 w-3 text-primary mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-medium text-primary mt-2">
                      ${option.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LensSelector;
