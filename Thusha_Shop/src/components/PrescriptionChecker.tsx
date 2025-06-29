import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/context/UserContext";
import { Prescription } from "@/types/user";

interface PrescriptionCheckerProps {
  onPrescriptionVerified: (prescriptionData: Prescription) => void;
  onCancel: () => void;
}

const API_BASE_URL = "http://localhost:8000";

const PrescriptionChecker = ({
  onPrescriptionVerified,
  onCancel,
}: PrescriptionCheckerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const fetchActivePrescription = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/prescriptions/`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });

        const prescriptions = response.data;

        // Find the active prescription
        const active = prescriptions.find((p: Prescription) => p.status?.toLowerCase() === "active");

        if (active) {
          const formattedPrescription: Prescription = {
            ...active,
            id: active.id,
            prescription_id: active.prescription_id || active.id,
            doctor_name: active.doctor_name,
            patient_name: active.patient_name,
            date_issued: active.date_issued,
            expiry_date: active.expiry_date,
            right_sphere: active.right_sphere,
            right_cylinder: active.right_cylinder,
            right_axis: active.right_axis,
            left_sphere: active.left_sphere,
            left_cylinder: active.left_cylinder,
            left_axis: active.left_axis,
            pupillary_distance: active.pupillary_distance,
            status: active.status,
            patient_email_display: active.patient_email_display,
            additional_notes: active.additional_notes
          };

          setActivePrescription(formattedPrescription);
          setShowSuccessDialog(true);
          onPrescriptionVerified(formattedPrescription);
        } else {
          toast({
            title: "No Active Prescription",
            description: "You don't have any active prescriptions.",
            variant: "destructive",
          });
        }

      } catch (error) {
        console.error("Error fetching prescription:", error);

        let errorMessage = "Failed to fetch prescription.";
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            errorMessage = "Prescription not found.";
          } else if (error.response?.status === 401) {
            errorMessage = "Please log in to access your prescription.";
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Add a debounce to prevent multiple rapid requests
    const debounceTimer = setTimeout(() => {
      fetchActivePrescription();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [onPrescriptionVerified, toast, user?.id]);


  const handleUsePrescription = () => {
    if (activePrescription) {
      onPrescriptionVerified(activePrescription);
      setShowSuccessDialog(false);
    }
  };

  return (
    <>
      <motion.div
        className="rounded-lg border bg-card p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Your Prescription</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? "Loading your prescription..." :
                activePrescription ? "We found your active prescription" :
                  "No active prescription found"}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activePrescription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Patient</h4>
                  <p>{activePrescription.patient_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Doctor</h4>
                  <p>{activePrescription.doctor_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Issued</h4>
                  <p>{new Date(activePrescription.date_issued).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Expires</h4>
                  <p>{new Date(activePrescription.expiry_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUsePrescription}
                >
                  Use This Prescription
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">You don't have an active prescription.</p>
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => window.location.href = "/doctor-appointment"}
                >
                  Book an Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescription Found</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>We found your active prescription from Dr. {activePrescription?.doctor_name}.</p>
            <div className="flex justify-end">
              <Button onClick={handleUsePrescription}>Continue</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrescriptionChecker;