import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PasswordChangeForm from '@/components/account/PasswordChangeForm';
import DoctorOverview from '@/components/dashboard/DoctorOverview';
import DoctorAppointmentsTab from '@/components/dashboard/DoctorAppointmentsTab';
import DoctorPrescriptionsTab from '@/components/dashboard/DoctorPrescriptionsTab';
import DoctorProfileTab from '@/components/dashboard/DoctorProfileTab';
import PrescriptionForm from '@/components/dashboard/PrescriptionForm';

const DoctorDashboard = () => {
  const { toast } = useToast();
  
  // State for managing appointments and prescriptions
  const [appointments, setAppointments] = useState([
    { id: "APT-001", patientName: "Michael Brown", date: "2024-07-10", time: "11:00 AM", type: "Check-up", status: "scheduled" },
    { id: "APT-002", patientName: "Emma Wilson", date: "2024-07-11", time: "02:30 PM", type: "Consultation", status: "scheduled" },
    { id: "APT-003", patientName: "Daniel Lee", date: "2024-07-12", time: "09:00 AM", type: "Follow-up", status: "completed" }
  ]);

  // State for prescriptions
  const [prescriptions, setPrescriptions] = useState([
    { 
      id: "RX-001", 
      patientName: "Michael Brown", 
      date: "2024-07-05", 
      details: "Nearsightedness correction",
      rightEye: { sphere: -2.5, cylinder: -0.5, axis: 90 },
      leftEye: { sphere: -2.25, cylinder: -0.25, axis: 85 },
      pupillaryDistance: 64,
      doctorName: "Dr. Smith",
      dateIssued: "2024-07-05",
      expiryDate: "2025-07-05"
    },
    { 
      id: "RX-002", 
      patientName: "Emma Wilson", 
      date: "2024-07-06", 
      details: "Astigmatism management",
      rightEye: { sphere: -1.0, cylinder: -1.5, axis: 180 },
      leftEye: { sphere: -1.25, cylinder: -1.0, axis: 175 },
      pupillaryDistance: 62,
      doctorName: "Dr. Smith",
      dateIssued: "2024-07-06",
      expiryDate: "2025-07-06"
    }
  ]);

  // State for doctor profile
  const [doctorProfile, setDoctorProfile] = useState({
    name: "Dr. Sarah Smith",
    specialization: "Ophthalmologist",
    experience: "15 years",
    qualifications: "MD, FRCS",
    expertise: ["Cataract Surgery", "Retinal Disorders", "Glaucoma Treatment"],
    biography: "Experienced ophthalmologist specializing in comprehensive eye care with focus on surgical interventions."
  });

  // State for managing the prescription creation form
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    details: "",
    rightEye: { sphere: 0, cylinder: 0, axis: 0 },
    leftEye: { sphere: 0, cylinder: 0, axis: 0 },
    pupillaryDistance: 64
  });

  // State for profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(doctorProfile);

  // Handler functions for appointments
  const handleViewAppointment = (id: string) => {
    toast({
      title: "View Appointment",
      description: `Viewing details for appointment ${id}`,
    });
  };

  const handleUpdateAppointmentStatus = (id: string, status: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
    
    const statusText = status === 'completed' ? 'completed' : 'cancelled';
    toast({
      title: "Appointment Updated",
      description: `Appointment ${id} has been ${statusText}`,
    });
  };

  // Handler functions for prescriptions
  const handleCreatePrescription = () => {
    setShowPrescriptionForm(true);
  };

  const handleSavePrescription = () => {
    const prescriptionWithDate = {
      id: `RX-${Date.now()}`,
      ...newPrescription,
      date: new Date().toISOString().split('T')[0],
      doctorName: doctorProfile.name,
      dateIssued: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setPrescriptions([...prescriptions, prescriptionWithDate]);
    setNewPrescription({
      patientName: "",
      details: "",
      rightEye: { sphere: 0, cylinder: 0, axis: 0 },
      leftEye: { sphere: 0, cylinder: 0, axis: 0 },
      pupillaryDistance: 64
    });
    setShowPrescriptionForm(false);

    toast({
      title: "Prescription Created",
      description: `New prescription created for ${newPrescription.patientName}`,
    });
  };

  const handleCancelPrescription = () => {
    setShowPrescriptionForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPrescription({ ...newPrescription, [e.target.name]: e.target.value });
  };

  const handleEyeValueChange = (eye: 'rightEye' | 'leftEye', field: string, value: number) => {
    setNewPrescription({
      ...newPrescription,
      [eye]: { ...newPrescription[eye], [field]: value }
    });
  };

  const handlePupillaryDistanceChange = (value: number) => {
    setNewPrescription({ ...newPrescription, pupillaryDistance: value });
  };

  // Profile management handlers
  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setDoctorProfile(profileForm);
    setEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleProfileChange = (field: string, value: string | string[]) => {
    setProfileForm({ ...profileForm, [field]: value });
  };

  const addExpertise = () => {
    const newExpertise = prompt("Enter new area of expertise:");
    if (newExpertise) {
      setProfileForm({
        ...profileForm,
        expertise: [...profileForm.expertise, newExpertise]
      });
    }
  };

  const removeExpertise = (index: number) => {
    setProfileForm({
      ...profileForm,
      expertise: profileForm.expertise.filter((_, i) => i !== index)
    });
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    setProfileForm(doctorProfile);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your practice, appointments, and patient care</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DoctorOverview
            appointments={appointments}
            prescriptions={prescriptions}
            doctorProfile={doctorProfile}
            onViewAppointment={handleViewAppointment}
          />
        </TabsContent>

        <TabsContent value="appointments">
          <DoctorAppointmentsTab
            appointments={appointments}
            onViewAppointment={handleViewAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          />
        </TabsContent>

        <TabsContent value="prescriptions">
          <DoctorPrescriptionsTab
            prescriptions={prescriptions}
            onCreatePrescription={handleCreatePrescription}
          />
        </TabsContent>

        <TabsContent value="profile">
          <DoctorProfileTab
            doctorProfile={doctorProfile}
            editingProfile={editingProfile}
            profileForm={profileForm}
            onEditProfile={handleEditProfile}
            onSaveProfile={handleSaveProfile}
            onProfileChange={handleProfileChange}
            onAddExpertise={addExpertise}
            onRemoveExpertise={removeExpertise}
            onCancelEdit={handleCancelEdit}
          />
        </TabsContent>

        <TabsContent value="settings">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Prescription Creation Modal */}
      {showPrescriptionForm && (
        <PrescriptionForm
          newPrescription={newPrescription}
          onInputChange={handleInputChange}
          onEyeValueChange={handleEyeValueChange}
          onSave={handleSavePrescription}
          onCancel={handleCancelPrescription}
          onPupillaryDistanceChange={handlePupillaryDistanceChange}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;