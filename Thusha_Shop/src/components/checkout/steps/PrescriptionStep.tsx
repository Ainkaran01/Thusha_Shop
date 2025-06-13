
import React from 'react';
import PrescriptionVerifier from '../PrescriptionVerifier';

interface PrescriptionStepProps {
  prescriptionVerified: boolean;
  needsPrescriptionVerification: boolean;
  onPrescriptionVerified: (id: string) => void;
  onSkipPrescription: () => void;
}

const PrescriptionStep: React.FC<PrescriptionStepProps> = ({
  prescriptionVerified,
  needsPrescriptionVerification,
  onPrescriptionVerified,
  onSkipPrescription,
}) => {
  return (
    <PrescriptionVerifier 
      onPrescriptionVerified={onPrescriptionVerified}
      onSkip={onSkipPrescription}
      required={needsPrescriptionVerification}
    />
  );
};

export default PrescriptionStep;
