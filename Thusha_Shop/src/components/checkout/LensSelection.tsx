import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";
import { Glasses, Eye } from "lucide-react";
import PrescriptionChecker from '../PrescriptionChecker';
import { Prescription } from '@/types/user';

interface LensOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface LensOptions {
  standard: LensOption[];
  prescription: LensOption[];
}

interface LensSelectionProps {
  eyeglassesItems: CartItem[];
  lensOptions: LensOptions;
  onLensTypeSelect: (productId: number, lensType: "standard" | "prescription") => void;
  onLensOptionSelect: (productId: number, lensType: "standard" | "prescription", optionId: string) => void;
}

const LensSelection: React.FC<LensSelectionProps> = ({
  eyeglassesItems,
  lensOptions,
  onLensTypeSelect,
  onLensOptionSelect,
}) => {
  const [showChecker, setShowChecker] = useState(false);
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);

  const formatPrescriptionValue = (value: string | null | undefined) =>
    value ? value : "N/A";

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  const handleLensTypeSelect = (productId: number, type: "standard" | "prescription") => {
    onLensTypeSelect(productId, type);

    if (type === "prescription") {
      if (!activePrescription) {
        setShowChecker(true);
      } else {
        const item = eyeglassesItems.find(i => i.product.id === productId);
        if (item?.lensOption) {
          item.lensOption.prescriptionId = String(activePrescription.id);
        }
      }
    }
  };

  const handleVerifySuccess = (verifiedPrescription: Prescription) => {
    setActivePrescription(verifiedPrescription);
    eyeglassesItems.forEach(item => {
      if (item.lensOption?.type === "prescription") {
          item.lensOption.prescriptionId = String(verifiedPrescription.id); // 🔥 FIXED
             }

    });
    setShowChecker(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Lens Options</h2>

      {eyeglassesItems.map(item => {
        const currentLensType = item.lensOption?.type;
        const currentLensOption = item.lensOption?.option;

        return (
          <div key={item.product.id} className="p-4 border border-border rounded-md mb-6">
            <div className="flex items-start mb-4">
              {item.product.images?.[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
              )}
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {[item.product.frame_type, item.product.frame_material, item.product.colors]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <Label className="text-base font-medium mb-2 block">Lens Type</Label>
              <RadioGroup
                value={currentLensType || ""}
                onValueChange={(value) => handleLensTypeSelect(item.product.id, value as "standard" | "prescription")}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent">
                  <RadioGroupItem value="standard" id={`standard-${item.product.id}`} />
                  <Label htmlFor={`standard-${item.product.id}`} className="cursor-pointer flex items-center">
                    <Glasses className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Standard Lenses</div>
                      <div className="text-sm text-muted-foreground">Regular non-prescription lenses</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent">
                  <RadioGroupItem value="prescription" id={`prescription-${item.product.id}`} />
                  <Label htmlFor={`prescription-${item.product.id}`} className="cursor-pointer flex items-center">
                    <Eye className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Prescription Lenses</div>
                      <div className="text-sm text-muted-foreground">Custom prescription lenses</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {currentLensType === "prescription" && activePrescription && (
              <Card className="mb-4 bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Your Active Prescription</span>
                    <Badge variant="secondary" className="ml-2">Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Right Eye (OD)</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Sphere:</span>
                          <span className="font-medium">{formatPrescriptionValue(activePrescription.right_sphere)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cylinder:</span>
                          <span className="font-medium">{formatPrescriptionValue(activePrescription.right_cylinder)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Axis:</span>
                          <span className="font-medium">{formatPrescriptionValue(activePrescription.right_axis)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Left Eye (OS)</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Sphere:</span>
                          <span className="font-medium">{formatPrescriptionValue(activePrescription.left_sphere)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cylinder:</span>
                          <span className="font-medium">{formatPrescriptionValue(activePrescription.left_cylinder)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Axis:</span>
                          <span className="font-medium">{formatPrescriptionValue(activePrescription.left_axis)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-sm">
                    <span>Doctor:</span>
                    <span className="font-medium">{formatPrescriptionValue(activePrescription.doctor_name)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Date:</span>
                    <span className="font-medium">{formatDate(activePrescription.date_issued)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentLensType === "prescription" && !activePrescription && (
              <Card className="mb-4 bg-orange-50 border-orange-200">
                <CardContent className="pt-4">
                  <div className="flex items-center text-orange-800">
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      No active prescription found. Please verify your prescription to continue.
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentLensType && (
              <div className="mb-4">
                <Label className="text-base font-medium mb-2 block">Select Lens Option</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(currentLensType === "standard" ? lensOptions.standard : lensOptions.prescription).map(option => (
                    <div
                      key={option.id}
                      className={`border rounded-md p-3 hover:bg-accent cursor-pointer ${
                        currentLensOption === option.name ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => onLensOptionSelect(item.product.id, currentLensType, option.id)}
                    >
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{option.description}</div>
                      <div className="text-sm font-semibold">LKR {option.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {showChecker && (
        <div className="mt-6">
          <PrescriptionChecker
            onPrescriptionVerified={handleVerifySuccess}
            onCancel={() => setShowChecker(false)}
          />
        </div>
      )}
    </div>
  );
};

export default LensSelection;
