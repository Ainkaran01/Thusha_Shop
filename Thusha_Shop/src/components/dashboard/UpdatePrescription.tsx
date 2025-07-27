import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Prescription } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

interface UpdatePrescriptionProps {
  prescription: Prescription;
  onUpdateSuccess: () => void;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
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
    <div className="space-y-3 p-1">
      {/* Patient Info */}
      <div className="bg-white/80 p-3 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-100 p-2 rounded-full">
            <FileText className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium">{prescription.patient_name}</h3>
            <p className="text-sm text-gray-600">{prescription.patient_email_display}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <Label className="text-xs text-gray-500">Prescription ID</Label>
            <p className="font-medium">{prescription.prescription_id}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Date Issued</Label>
            <p className="font-medium">{formatDate(prescription.date_issued)}</p>
          </div>
        </div>
      </div>

      {/* Prescription Values */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-3 rounded-lg border border-yellow-200">
        <h3 className="text-sm font-semibold mb-2 text-yellow-700">Prescription Values</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-medium">Right Eye (OD)</Label>
            <div className="space-y-1 mt-1">
              <Input 
                name="right_sphere" 
                placeholder="SPH" 
                 type="number"
                value={formData.right_sphere} 
                onChange={handleChange}
                className="h-8 text-sm"
              />
              <Input 
                name="right_cylinder" 
                placeholder="CYL" 
                 type="number"
                value={formData.right_cylinder} 
                onChange={handleChange}
                className="h-8 text-sm"
              />
              <Input 
                name="right_axis" 
                placeholder="Axis" 
                 type="number"
                value={formData.right_axis} 
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium">Left Eye (OS)</Label>
            <div className="space-y-1 mt-1">
              <Input 
                name="left_sphere" 
                placeholder="SPH" 
                 type="number"
                value={formData.left_sphere} 
                onChange={handleChange}
                className="h-8 text-sm"
              />
              <Input 
                name="left_cylinder" 
                placeholder="CYL" 
                 type="number"
                value={formData.left_cylinder} 
                onChange={handleChange}
                className="h-8 text-sm"
              />
              <Input 
                name="left_axis" 
                placeholder="Axis"
                type="number"
                value={formData.left_axis} 
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
          <Label className="text-xs font-medium">Pupillary Distance (mm)</Label>
          <Input
            type="number"
            name="pupillary_distance"
            value={formData.pupillary_distance}
            onChange={handleChange}
            className="h-8 text-sm mt-1"
          />
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
          <Label className="text-xs font-medium">Additional Notes</Label>
          <Textarea
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleChange}
            className="h-16 text-sm mt-1"
          />
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white text-sm py-2 shadow-sm"
      >
        Update Prescription
      </Button>
    </div>
  );
};

export default UpdatePrescription;