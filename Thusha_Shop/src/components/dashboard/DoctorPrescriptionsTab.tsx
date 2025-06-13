
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PrescriptionDisplay from '@/components/PrescriptionDisplay';

interface DoctorPrescriptionsTabProps {
  prescriptions: any[];
  onCreatePrescription: () => void;
}

const DoctorPrescriptionsTab = ({ prescriptions, onCreatePrescription }: DoctorPrescriptionsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Prescription Management</CardTitle>
        <Button onClick={onCreatePrescription} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Prescription
        </Button>
      </CardHeader>
      <CardContent>
        <PrescriptionDisplay 
          prescriptions={prescriptions} 
          title="Issued Prescriptions" 
        />
      </CardContent>
    </Card>
  );
};

export default DoctorPrescriptionsTab;