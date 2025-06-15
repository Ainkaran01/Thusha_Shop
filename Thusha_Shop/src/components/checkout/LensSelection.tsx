
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";
import { useUser } from "@/context/UserContext";
import { Glasses, Eye } from "lucide-react";

interface LensSelectionProps {
  eyeglassesItems: CartItem[];
  lensOptions: {
    standard: Array<{ id: string; name: string; price: number; description: string }>;
    prescription: Array<{ id: string; name: string; price: number; description: string }>;
  };
  onLensTypeSelect: (productId: number, lensType: "standard" | "prescription") => void;
  onLensOptionSelect: (productId: number, lensType: "standard" | "prescription", optionId: string) => void;
}

const LensSelection: React.FC<LensSelectionProps> = ({
  eyeglassesItems,
  lensOptions,
  onLensTypeSelect,
  onLensOptionSelect,
}) => {
  const { user } = useUser();
  
  // Get the user's active prescription - first try isActive, then fall back to first prescription
  const activePrescription = user?.prescriptions?.find(p => p.isActive === true) || user?.prescriptions?.[0];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Lens Options</h3>
      
      {eyeglassesItems.map(item => (
        <div key={item.product.id} className="p-4 border border-border rounded-md mb-6">
          <div className="flex items-start mb-4">
            <img 
              src={item.product.images[0]} 
              alt={item.product.name} 
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div>
              <h4 className="font-semibold">{item.product.name}</h4>
              <p className="text-sm text-muted-foreground">
                {item.product.frameType}, {item.product.frameMaterial}, {item.product.color}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <Label className="text-base font-medium mb-2 block">Lens Type</Label>
            <RadioGroup 
              value={item.lensOption?.type || ""} 
              onValueChange={(value: "standard" | "prescription") => onLensTypeSelect(item.product.id, value)}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent">
                <RadioGroupItem value="standard" id={`standard-${item.product.id}`} />
                <Label htmlFor={`standard-${item.product.id}`} className="cursor-pointer flex items-center">
                  <Glasses className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Normal Lens</div>
                    <div className="text-sm text-muted-foreground">Regular non-prescription lenses</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent">
                <RadioGroupItem value="prescription" id={`prescription-${item.product.id}`} />
                <Label htmlFor={`prescription-${item.product.id}`} className="cursor-pointer flex items-center">
                  <Eye className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Powered Lens</div>
                    <div className="text-sm text-muted-foreground">Custom prescription lenses</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show prescription details if powered lens is selected */}
          {item.lensOption?.type === "prescription" && activePrescription && (
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Eye className="mr-2 h-4 w-4 text-blue-600" />
                  Your Active Prescription
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Right Eye (OD)</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Sphere:</span>
                        <span className="font-medium">{activePrescription.sphereRight || activePrescription.rightEye?.sphere || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cylinder:</span>
                        <span className="font-medium">{activePrescription.cylinderRight || activePrescription.rightEye?.cylinder || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Axis:</span>
                        <span className="font-medium">{activePrescription.axisRight || activePrescription.rightEye?.axis || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Left Eye (OS)</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Sphere:</span>
                        <span className="font-medium">{activePrescription.sphereLeft || activePrescription.leftEye?.sphere || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cylinder:</span>
                        <span className="font-medium">{activePrescription.cylinderLeft || activePrescription.leftEye?.cylinder || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Axis:</span>
                        <span className="font-medium">{activePrescription.axisLeft || activePrescription.leftEye?.axis || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span>Doctor:</span>
                  <span className="font-medium">{activePrescription.doctor || activePrescription.doctorName || "Not specified"}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Date:</span>
                  <span className="font-medium">{new Date(activePrescription.date || activePrescription.dateIssued).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show message if powered lens selected but no prescription available */}
          {item.lensOption?.type === "prescription" && !activePrescription && (
            <Card className="mb-4 bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="flex items-center text-orange-800">
                  <Eye className="mr-2 h-4 w-4" />
                  <span className="text-sm">No prescription found. Please add your prescription in your account settings before proceeding.</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {item.lensOption?.type && (
            <div className="mb-4">
              <Label className="text-base font-medium mb-2 block">Select Lens Option</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(item.lensOption.type === "standard" ? lensOptions.standard : lensOptions.prescription).map(option => (
                  <div 
                    key={option.id}
                    className={`border rounded-md p-3 hover:bg-accent cursor-pointer ${
                      item.lensOption?.option === option.name ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => onLensOptionSelect(item.product.id, item.lensOption?.type || "standard", option.id)}
                  >
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{option.description}</div>
                    <div className="text-sm font-semibold">${option.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LensSelection;
