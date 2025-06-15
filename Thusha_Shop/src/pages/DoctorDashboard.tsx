import React, { useState, useEffect } from 'react';
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

const API_BASE_URL = 'http://localhost:8000/api/doctors'; // Adjust as needed

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const DoctorDashboard = () => {
  const { toast } = useToast();

  // ----- Demo States for Non-Profile Tabs -----
  const [appointments, setAppointments] = useState([
    { id: 'APT-001', patientName: 'Michael Brown', date: '2024-07-10', time: '11:00 AM', type: 'Check-up', status: 'scheduled' },
    { id: 'APT-002', patientName: 'Emma Wilson', date: '2024-07-11', time: '02:30 PM', type: 'Consultation', status: 'scheduled' },
    { id: 'APT-003', patientName: 'Daniel Lee', date: '2024-07-12', time: '09:00 AM', type: 'Follow-up', status: 'completed' }
  ]);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX-001',
      patientName: 'Michael Brown',
      date: '2024-07-05',
      details: 'Nearsightedness correction',
      rightEye: { sphere: -2.5, cylinder: -0.5, axis: 90 },
      leftEye: { sphere: -2.25, cylinder: -0.25, axis: 85 },
      pupillaryDistance: 64,
      doctorName: 'Dr. Smith',
      dateIssued: '2024-07-05',
      expiryDate: '2025-07-05',
    },
    {
      id: 'RX-002',
      patientName: 'Emma Wilson',
      date: '2024-07-06',
      details: 'Astigmatism management',
      rightEye: { sphere: -1.0, cylinder: -1.5, axis: 180 },
      leftEye: { sphere: -1.25, cylinder: -1.0, axis: 175 },
      pupillaryDistance: 62,
      doctorName: 'Dr. Smith',
      dateIssued: '2024-07-06',
      expiryDate: '2025-07-06',
    },
  ]);

  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    details: '',
    rightEye: { sphere: 0, cylinder: 0, axis: 0 },
    leftEye: { sphere: 0, cylinder: 0, axis: 0 },
    pupillaryDistance: 64,
  });

  // ----- Profile API Integration (Don't Modify) -----
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await fetch(`${API_BASE_URL}/profile/`, {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setDoctorProfile(data);
        setProfileForm(data);
      } catch (error) {
        toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const onEditProfile = () => setEditingProfile(true);
  const onCancelEdit = () => {
    setEditingProfile(false);
    setProfileForm(doctorProfile);
  };
  const onProfileChange = (field: string, value: string) => {
    setProfileForm({ ...profileForm, [field]: value });
  };
  const onSaveProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      setDoctorProfile(updated);
      setProfileForm(updated);
      setEditingProfile(false);
      toast({ title: 'Success', description: 'Profile updated' });
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  // ----- Handlers for Demo Tabs -----
  const handleViewAppointment = (id: string) => {
    toast({ title: 'View Appointment', description: `Viewing appointment ${id}` });
  };
  const handleUpdateAppointmentStatus = (id: string, status: string) => {
    setAppointments(appointments.map(appt => appt.id === id ? { ...appt, status } : appt));
    toast({ title: 'Appointment Updated', description: `Appointment ${id} marked ${status}` });
  };

  const handleCreatePrescription = () => setShowPrescriptionForm(true);
  const handleSavePrescription = () => {
    const newRx = {
      id: `RX-${Date.now()}`,
      ...newPrescription,
      doctorName: doctorProfile?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      dateIssued: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    };
    setPrescriptions([...prescriptions, newRx]);
    setNewPrescription({
      patientName: '',
      details: '',
      rightEye: { sphere: 0, cylinder: 0, axis: 0 },
      leftEye: { sphere: 0, cylinder: 0, axis: 0 },
      pupillaryDistance: 64,
    });
    setShowPrescriptionForm(false);
    toast({ title: 'Prescription Created', description: `For ${newRx.patientName}` });
  };
  const handleCancelPrescription = () => setShowPrescriptionForm(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setNewPrescription({ ...newPrescription, [e.target.name]: e.target.value });
  const handleEyeValueChange = (eye: 'rightEye' | 'leftEye', field: string, value: number) =>
    setNewPrescription({ ...newPrescription, [eye]: { ...newPrescription[eye], [field]: value } });
  const handlePupillaryDistanceChange = (value: number) =>
    setNewPrescription({ ...newPrescription, pupillaryDistance: value });

  if (loadingProfile || !doctorProfile) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
            onEditProfile={onEditProfile}
            onSaveProfile={onSaveProfile}
            onProfileChange={onProfileChange}
            onCancelEdit={onCancelEdit}
          />
        </TabsContent>

        <TabsContent value="settings">
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
        </TabsContent>
      </Tabs>

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
