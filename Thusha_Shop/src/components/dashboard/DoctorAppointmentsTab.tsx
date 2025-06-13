
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';

interface DoctorAppointmentsTabProps {
  appointments: any[];
  onViewAppointment: (id: string) => void;
  onUpdateAppointmentStatus: (id: string, status: string) => void;
}

const DoctorAppointmentsTab = ({ appointments, onViewAppointment, onUpdateAppointmentStatus }: DoctorAppointmentsTabProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewAppointmentDetails = (appointment: {
    id: string;
    patientName: string;
    date: string;
    time: string;
    type: string;
    status?: string;
    notes?: string;
  }) => {
    setSelectedAppointment(appointment);
    setAppointmentDialogOpen(true);
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      setIsLoading(true);
      await onUpdateAppointmentStatus(appointmentId, 'completed');
    } catch (err) {
      setError('Failed to complete appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        {error}
        <Button onClick={() => setError(null)} className="ml-2">Dismiss</Button>
      </div>
    );
  }

  const handleCancelAppointment = (appointmentId: string) => {
    onUpdateAppointmentStatus(appointmentId, 'cancelled');
  };

  const getStatusBadge = (type: string, status?: string) => {
    if (status === 'completed') {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'cancelled') {
      return 'bg-red-100 text-red-800';
    }
    
    const statusColors: { [key: string]: string } = {
      'Check-up': 'bg-blue-100 text-blue-800',
      'Consultation': 'bg-green-100 text-green-800',
      'Follow-up': 'bg-yellow-100 text-yellow-800',
      'Emergency': 'bg-red-100 text-red-800',
      'Surgery Consultation': 'bg-purple-100 text-purple-800'
    };
    
    return statusColors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (appointment: any) => {
    if (appointment.status) {
      return appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
    }
    return appointment.type;
  };

  const canManageAppointment = (appointment: any) => {
    return !appointment.status || appointment.status === 'scheduled';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type/Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.patientName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(appointment.type, appointment.status)} variant="secondary">
                        {getStatusText(appointment)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewAppointmentDetails(appointment)}
                        >
                          View Details
                        </Button>
                        {canManageAppointment(appointment) && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Complete Appointment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to mark this appointment as completed? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCompleteAppointment(appointment.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Mark Complete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this appointment? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Cancel Appointment
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Appointment ID</h3>
                  <p className="font-medium">{selectedAppointment.id}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                  <Badge className={getStatusBadge(selectedAppointment.type, selectedAppointment.status)} variant="secondary">
                    {getStatusText(selectedAppointment)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Patient Name</h3>
                  <p className="font-medium">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Date & Time</h3>
                  <p className="font-medium">{selectedAppointment.date} at {selectedAppointment.time}</p>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Appointment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Date:</span>
                    <span>{selectedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Time:</span>
                    <span>{selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Appointment Type:</span>
                    <span>{selectedAppointment.type}</span>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="mt-1">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => onViewAppointment(selectedAppointment.id)}>
                  Open Full Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorAppointmentsTab;