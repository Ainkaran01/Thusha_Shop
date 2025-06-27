import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Prescription } from '@/types/user';
import UpdatePrescription from './dashboard/UpdatePrescription';

interface PrescriptionDisplayProps {
  prescriptions: Prescription[];
  title?: string;
  onRefreshPrescriptions?: () => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDoctorName = (name?: string | null) => {
  if (!name || name.trim() === "") return "Dr. Unknown";
  return name.startsWith("Dr.") ? name : `Dr. ${name}`;
};

const getNumberColor = (value: string | null | undefined) => {
  if (!value) return {};
  const number = parseFloat(value);
  if (isNaN(number)) return {};
  if (number < 0) return { color: 'red' };
  if (number > 0) return { color: 'green' };
  return {};
};

const PrescriptionDisplay: React.FC<PrescriptionDisplayProps> = ({ prescriptions, title = "My Prescriptions", onRefreshPrescriptions }) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [prescriptionToUpdate, setPrescriptionToUpdate] = useState<Prescription | null>(null);

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
  };

  const handleOpenUpdateDialog = (prescription: Prescription) => {
    setPrescriptionToUpdate(prescription);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    setUpdateDialogOpen(false);
    setPrescriptionToUpdate(null);
    if (onRefreshPrescriptions) {
      onRefreshPrescriptions();
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No prescriptions available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Visit an optometrist to get a prescription for your eyewear
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">{prescription.prescription_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatDate(prescription.date_issued)}</span>
                    {renderStatusBadge(prescription.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Right Eye (OD)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sphere (SPH)</p>
                        <p style={getNumberColor(prescription.right_sphere)}>{prescription.right_sphere ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cylinder (CYL)</p>
                        <p style={getNumberColor(prescription.right_cylinder)}>{prescription.right_cylinder ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Axis</p>
                        <p style={getNumberColor(prescription.right_axis)}>{prescription.right_axis ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">PD</p>
                        <p>{prescription.pupillary_distance ? (prescription.pupillary_distance / 2) : "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Left Eye (OS)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sphere (SPH)</p>
                        <p style={getNumberColor(prescription.left_sphere)}>{prescription.left_sphere ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cylinder (CYL)</p>
                        <p style={getNumberColor(prescription.left_cylinder)}>{prescription.left_cylinder ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Axis</p>
                        <p style={getNumberColor(prescription.left_axis)}>{prescription.left_axis ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">PD</p>
                        <p>{prescription.pupillary_distance ? (prescription.pupillary_distance / 2) : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm">
                    <div>
                      <span className="text-muted-foreground">Patient:</span> {prescription.patient_name}
                    </div>
                    {prescription.patient_email_display && (
                      <div className="text-muted-foreground text-xs">{prescription.patient_email_display}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPrescription(prescription)}
                      className="text-primary hover:bg-primary/10"
                    >
                      View Details
                    </Button>

                    {prescription.status.toLowerCase() === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenUpdateDialog(prescription)}
                        className="text-primary hover:bg-primary/10"
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Prescription ID</h3>
                  <p>{selectedPrescription.prescription_id}</p>
                </div>
                <div>
                  <h3 className="font-medium">Date Issued</h3>
                  <p>{formatDate(selectedPrescription.date_issued)}</p>
                </div> 
                <div>
                 <h3 className="font-medium">Patient Name</h3>
                 <p>{selectedPrescription.patient_name ?? "Not specified"}</p>
              </div>

               <div>
                  <h3 className="font-medium">Patient Email</h3>
                <p className="text-muted-foreground text-sm">
                {selectedPrescription.patient_email_display ?? "Not provided"}
                 </p>
               </div>
              </div>
        
              <div>
                <h3 className="font-medium">Doctor</h3>
                <p>{formatDoctorName(selectedPrescription.doctor_name)}</p>
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-4 text-primary">Prescription Values</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Right Eye (OD)</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Sphere</td>
                          <td className="py-2 text-right" style={getNumberColor(selectedPrescription.right_sphere)}>{selectedPrescription.right_sphere ?? "N/A"}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Cylinder</td>
                          <td className="py-2 text-right" style={getNumberColor(selectedPrescription.right_cylinder)}>{selectedPrescription.right_cylinder ?? "N/A"}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Axis</td>
                          <td className="py-2 text-right" style={getNumberColor(selectedPrescription.right_axis)}>{selectedPrescription.right_axis ?? "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground">PD</td>
                          <td className="py-2 text-right">{selectedPrescription.pupillary_distance ? (selectedPrescription.pupillary_distance / 2) : "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Left Eye (OS)</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Sphere</td>
                          <td className="py-2 text-right" style={getNumberColor(selectedPrescription.left_sphere)}>{selectedPrescription.left_sphere ?? "N/A"}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Cylinder</td>
                          <td className="py-2 text-right" style={getNumberColor(selectedPrescription.left_cylinder)}>{selectedPrescription.left_cylinder ?? "N/A"}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Axis</td>
                          <td className="py-2 text-right" style={getNumberColor(selectedPrescription.left_axis)}>{selectedPrescription.left_axis ?? "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground">PD</td>
                          <td className="py-2 text-right">{selectedPrescription.pupillary_distance ? (selectedPrescription.pupillary_distance / 2) : "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="text-sm bg-muted/50 p-3 rounded-md">
                {selectedPrescription.status.toLowerCase() === 'expired' ? (
                  <p className="text-red-600 font-semibold">
                    This prescription expired on {formatDate(selectedPrescription.expiry_date)}.
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    This prescription was created on {formatDate(selectedPrescription.date_issued)} and expires on {formatDate(selectedPrescription.expiry_date)}.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Prescription</DialogTitle>
          </DialogHeader>
          {prescriptionToUpdate && (
            <UpdatePrescription
              prescription={prescriptionToUpdate}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrescriptionDisplay;
