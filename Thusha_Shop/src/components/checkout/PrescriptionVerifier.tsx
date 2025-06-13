
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { Prescription } from "@/types/user";
import { useUser } from "@/context/UserContext";

interface PrescriptionVerifierProps {
  prescription?: Prescription;
  onConfirm?: () => void;
  onCancel?: () => void;
  onPrescriptionVerified?: (id: string) => void;
  onSkip?: () => void;
  required?: boolean;
  open?: boolean;
}

const PrescriptionVerifier: React.FC<PrescriptionVerifierProps> = ({
  prescription,
  onConfirm,
  onCancel,
  onPrescriptionVerified,
  onSkip,
  required = false,
  open: controlledOpen,
}) => {
  const { toast } = useToast();
  const { setPrescriptionVerified } = useCart();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    if (prescription) {
      setSelectedPrescription(prescription);
    }
  }, [prescription]);
  
  // Handle controlled open state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen);
    } else if (prescription) {
      setOpen(true);
    }
  }, [controlledOpen, prescription]);

  const handleConfirm = () => {
    if (setPrescriptionVerified) {
      setPrescriptionVerified(true);
    }
    toast({
      title: "Prescription Verified",
      description: "You can now proceed with your order.",
    });
    
    if (onConfirm) {
      onConfirm();
    }
    
    if (selectedPrescription && onPrescriptionVerified) {
      onPrescriptionVerified(selectedPrescription.id);
    }
    
    setOpen(false);
  };

  const handleCancel = () => {
    if (setPrescriptionVerified) {
      setPrescriptionVerified(false);
    }
    
    if (onCancel) {
      onCancel();
    }
    
    setOpen(false);
  };

  const handleSkip = () => {
    if (!required && onSkip) {
      onSkip();
      setOpen(false);
    } else {
      toast({
        title: "Prescription Required",
        description: "A prescription is required for this order",
        variant: "destructive",
      });
    }
  };

  // Show prescription selector when no specific prescription is provided
  if (!prescription && user?.prescriptions?.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Select Your Prescription</h3>
        <div className="space-y-3">
          {user.prescriptions.map((rx) => (
            <div 
              key={rx.id}
              className="border rounded-md p-4 cursor-pointer hover:bg-accent"
              onClick={() => {
                setSelectedPrescription(rx);
                setOpen(true);
              }}
            >
              <div className="font-medium">{rx.patientName || user.name}</div>
              <div className="text-sm text-muted-foreground">
                Date: {new Date(rx.date || rx.dateIssued).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Doctor: {rx.doctor || rx.doctorName || "Not specified"}
              </div>
            </div>
          ))}
        </div>
        
        {!required && (
          <Button variant="outline" onClick={handleSkip} className="w-full mt-2">
            Continue Without Prescription
          </Button>
        )}
      </div>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Prescription</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm that the following prescription details are correct.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {selectedPrescription && (
          <div className="grid gap-2">
            <div>
              <span className="font-semibold">Patient Name:</span>{" "}
              {selectedPrescription.patientName || user?.name}
            </div>
            <div>
              <span className="font-semibold">Doctor:</span> {selectedPrescription.doctor || selectedPrescription.doctorName}
            </div>
            <div>
              <span className="font-semibold">Sphere (Right):</span>{" "}
              {selectedPrescription.sphereRight || selectedPrescription.rightEye?.sphere}
            </div>
            <div>
              <span className="font-semibold">Sphere (Left):</span>{" "}
              {selectedPrescription.sphereLeft || selectedPrescription.leftEye?.sphere}
            </div>
            <div>
              <span className="font-semibold">Cylinder (Right):</span>{" "}
              {selectedPrescription.cylinderRight || selectedPrescription.rightEye?.cylinder}
            </div>
            <div>
              <span className="font-semibold">Cylinder (Left):</span>{" "}
              {selectedPrescription.cylinderLeft || selectedPrescription.leftEye?.cylinder}
            </div>
            <div>
              <span className="font-semibold">Axis (Right):</span>{" "}
              {selectedPrescription.axisRight || selectedPrescription.rightEye?.axis}
            </div>
            <div>
              <span className="font-semibold">Axis (Left):</span> {selectedPrescription.axisLeft || selectedPrescription.leftEye?.axis}
            </div>
          </div>
        )}
        <AlertDialogFooter>
          {!required && (
            <Button variant="outline" onClick={handleSkip} className="mr-auto">
              Skip
            </Button>
          )}
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrescriptionVerifier;
