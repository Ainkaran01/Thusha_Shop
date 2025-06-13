
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PrescriptionFormProps {
  newPrescription: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEyeValueChange: (eye: 'rightEye' | 'leftEye', field: string, value: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onPupillaryDistanceChange: (value: number) => void;
}

const PrescriptionForm = ({
  newPrescription,
  onInputChange,
  onEyeValueChange,
  onSave,
  onCancel,
  onPupillaryDistanceChange
}: PrescriptionFormProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4">
        <CardHeader>
          <CardTitle>Create New Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                name="patientName"
                value={newPrescription.patientName}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Right Eye (OD)</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="rightSphere">Sphere</Label>
                    <Input
                      id="rightSphere"
                      type="number"
                      step="0.25"
                      value={newPrescription.rightEye.sphere}
                      onChange={(e) => onEyeValueChange('rightEye', 'sphere', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rightCylinder">Cylinder</Label>
                    <Input
                      id="rightCylinder"
                      type="number"
                      step="0.25"
                      value={newPrescription.rightEye.cylinder}
                      onChange={(e) => onEyeValueChange('rightEye', 'cylinder', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rightAxis">Axis</Label>
                    <Input
                      id="rightAxis"
                      type="number"
                      min="0"
                      max="180"
                      value={newPrescription.rightEye.axis}
                      onChange={(e) => onEyeValueChange('rightEye', 'axis', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Left Eye (OS)</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="leftSphere">Sphere</Label>
                    <Input
                      id="leftSphere"
                      type="number"
                      step="0.25"
                      value={newPrescription.leftEye.sphere}
                      onChange={(e) => onEyeValueChange('leftEye', 'sphere', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="leftCylinder">Cylinder</Label>
                    <Input
                      id="leftCylinder"
                      type="number"
                      step="0.25"
                      value={newPrescription.leftEye.cylinder}
                      onChange={(e) => onEyeValueChange('leftEye', 'cylinder', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="leftAxis">Axis</Label>
                    <Input
                      id="leftAxis"
                      type="number"
                      min="0"
                      max="180"
                      value={newPrescription.leftEye.axis}
                      onChange={(e) => onEyeValueChange('leftEye', 'axis', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="pupillaryDistance">Pupillary Distance (PD)</Label>
              <Input
                id="pupillaryDistance"
                type="number"
                value={newPrescription.pupillaryDistance}
                onChange={(e) => onPupillaryDistanceChange(parseInt(e.target.value))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="details">Additional Notes</Label>
              <Textarea
                id="details"
                name="details"
                value={newPrescription.details}
                onChange={onInputChange}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Create Prescription</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PrescriptionForm;