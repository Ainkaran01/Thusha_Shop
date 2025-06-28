import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Prescription } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface UpdatePrescriptionProps {
  prescription: Prescription;
  onUpdateSuccess: () => void;
}

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
};

const UpdatePrescription: React.FC<UpdatePrescriptionProps> = ({ prescription, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    right_sphere: prescription.right_sphere || '',
    right_cylinder: prescription.right_cylinder || '',
    right_axis: prescription.right_axis || '',
    left_sphere: prescription.left_sphere || '',
    left_cylinder: prescription.left_cylinder || '',
    left_axis: prescription.left_axis || '',
    pupillary_distance: prescription.pupillary_distance || '',
    additional_notes: (prescription as any).additional_notes || '',
  });

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    };

    if (!headers.Authorization) {
      toast({
        title: 'Authentication Error',
        description: 'No access token found. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/prescriptions/${prescription.id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.detail || 'Failed to update prescription.';
        throw new Error(errorMsg);
      }

      toast({ title: 'Success', description: 'Prescription updated successfully.' });
      onUpdateSuccess();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message });
    }
  };

  return (
    <Card className="max-w-5xl mx-auto mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center">Update Prescription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Static Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">Prescription ID</Label>
            <p className="bg-gray-100 rounded px-3 py-1">{prescription.prescription_id}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Date Issued</Label>
            <p className="bg-gray-100 rounded px-3 py-1">{formatDate(prescription.date_issued)}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Patient Name</Label>
            <p className="bg-gray-100 rounded px-3 py-1">{prescription.patient_name}</p>
          </div>
           {/* <div>
            <Label className="text-muted-foreground">Doctor Name</Label>
            <p className="bg-gray-100 rounded px-3 py-1">{prescription.doctor_name}</p>
          </div> */}
          </div>
          <div>
            <Label className="text-muted-foreground">Patient Email</Label>
            <p className="bg-gray-100 rounded px-1 py-1">{prescription.patient_email_display}</p>
          </div>

        {/* Prescription Values */}
        <div className="border rounded-md p-4">
          <h2 className="text-md font-semibold text-yellow-600 mb-3">Prescription Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Right Eye (OD)</Label>
              <Input name="right_sphere" placeholder="Sphere" value={formData.right_sphere} onChange={handleChange} />
              <Input name="right_cylinder" placeholder="Cylinder" value={formData.right_cylinder} onChange={handleChange} />
              <Input name="right_axis" placeholder="Axis" value={formData.right_axis} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Left Eye (OS)</Label>
              <Input name="left_sphere" placeholder="Sphere" value={formData.left_sphere} onChange={handleChange} />
              <Input name="left_cylinder" placeholder="Cylinder" value={formData.left_cylinder} onChange={handleChange} />
              <Input name="left_axis" placeholder="Axis" value={formData.left_axis} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Other Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-semibold">Pupillary Distance</Label>
            <Input
              type="number"
              name="pupillary_distance"
              value={formData.pupillary_distance}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="font-semibold">Additional Notes</Label>
            <Textarea
              name="additional_notes"
              value={formData.additional_notes}
              onChange={handleChange}
              className="h-[70px]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 text-right">
          <Button onClick={handleSubmit} className="px-6">Update Prescription</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdatePrescription;
