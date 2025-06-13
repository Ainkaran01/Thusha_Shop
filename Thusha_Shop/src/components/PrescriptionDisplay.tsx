
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Prescription } from '@/types/user';

interface PrescriptionDisplayProps {
  prescriptions: Prescription[];
  title?: string;
}

const PrescriptionDisplay = ({ prescriptions, title = "My Prescriptions" }: PrescriptionDisplayProps) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
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
                    <span className="font-medium">{prescription.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{prescription.dateIssued}</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Right Eye (OD)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sphere (SPH)</p>
                        <p>{prescription.rightEye.sphere}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cylinder (CYL)</p>
                        <p>{prescription.rightEye.cylinder}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Axis</p>
                        <p>{prescription.rightEye.axis}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">PD</p>
                        <p>{prescription.pupillaryDistance / 2}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Left Eye (OS)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sphere (SPH)</p>
                        <p>{prescription.leftEye.sphere}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cylinder (CYL)</p>
                        <p>{prescription.leftEye.cylinder}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Axis</p>
                        <p>{prescription.leftEye.axis}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">PD</p>
                        <p>{prescription.pupillaryDistance / 2}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Doctor:</span> {prescription.doctorName}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewPrescription(prescription)}
                    className="text-primary hover:bg-primary/10"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prescription Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPrescription && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Prescription ID</h3>
                    <p>{selectedPrescription.id}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Date Issued</h3>
                    <p>{selectedPrescription.dateIssued}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">Patient</h3>
                  <p>{selectedPrescription.patientName || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="font-medium">Doctor</h3>
                  <p>{selectedPrescription.doctorName}</p>
                </div>
                
                <div className="border rounded-md p-4 bg-muted/30">
                  <h3 className="font-medium mb-4 text-primary">Prescription Values</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Right Eye (OD)</h4>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 text-muted-foreground">Sphere (SPH)</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.rightEye.sphere}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 text-muted-foreground">Cylinder (CYL)</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.rightEye.cylinder}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 text-muted-foreground">Axis</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.rightEye.axis}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-muted-foreground">PD</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.pupillaryDistance / 2}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Left Eye (OS)</h4>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 text-muted-foreground">Sphere (SPH)</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.leftEye.sphere}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 text-muted-foreground">Cylinder (CYL)</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.leftEye.cylinder}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 text-muted-foreground">Axis</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.leftEye.axis}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-muted-foreground">PD</td>
                            <td className="py-2 font-medium text-right">{selectedPrescription.pupillaryDistance / 2}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm bg-muted/50 p-3 rounded-md">
                  <p className="text-muted-foreground">
                    This prescription was created on {selectedPrescription.dateIssued} and expires on {selectedPrescription.expiryDate}.
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrescriptionDisplay;
