
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PrescriptionCheckerProps {
  onPrescriptionVerified: (prescriptionData: any) => void;
  onCancel: () => void;
}

const PrescriptionChecker = ({ onPrescriptionVerified, onCancel }: PrescriptionCheckerProps) => {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock prescription data that would come from a database
  const mockPrescriptions = {
    "RX-001": {
      patientName: "Michael Brown",
      date: "2025-05-09",
      sphereRight: "-2.25",
      sphereLeft: "-2.00",
      cylinderRight: "-0.75",
      cylinderLeft: "-0.50",
      axisRight: "90",
      axisLeft: "85",
      pdRight: "32",
      pdLeft: "32",
      doctor: "Dr. Emily Wilson"
    },
    "RX-002": {
      patientName: "Emma Wilson",
      date: "2025-05-05",
      sphereRight: "+1.25",
      sphereLeft: "+1.50",
      cylinderRight: "-0.25",
      cylinderLeft: "-0.50",
      axisRight: "180",
      axisLeft: "175",
      pdRight: "31.5",
      pdLeft: "31.5",
      doctor: "Dr. Michael Chen"
    }
  };

  const handleVerifyPrescription = () => {
    if (!prescriptionId) {
      toast({
        title: "Prescription ID Required",
        description: "Please enter your prescription ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      const prescription = mockPrescriptions[prescriptionId as keyof typeof mockPrescriptions];
      
      if (prescription) {
        toast({
          title: "Prescription Found",
          description: `Verified prescription for ${prescription.patientName}.`,
        });
        onPrescriptionVerified(prescription);
      } else {
        toast({
          title: "Invalid Prescription",
          description: "No prescription found with that ID. Please check and try again.",
          variant: "destructive",
        });
      }

      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div 
      className="rounded-lg border bg-card p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Enter Prescription Details</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Please enter the prescription ID provided by your optometrist
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prescription-id">Prescription ID</Label>
            <Input
              id="prescription-id"
              placeholder="e.g. RX-001"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Your prescription ID is in the format "RX-XXX" and can be found on your prescription document
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyPrescription}
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Verifying..." : "Verify Prescription"}
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium">Don't have a prescription?</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Book an appointment with one of our optometrists to get a prescription for your lenses.
          </p>
          <Button
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={() => window.location.href = "/doctor-appointment"}
          >
            Book an Appointment
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PrescriptionChecker;
