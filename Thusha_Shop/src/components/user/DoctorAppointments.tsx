import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/UserContext';
interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'pending' | 'cancelled';
  location: string;
  phone: string;
  reason: string;
  doctorDetails: DoctorDetails;

}
interface DoctorDetails {
  name: string;
  email: string;
  specialization: string;
 
}
const DoctorAppointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {user}=useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:8000/api/appointments";

  useEffect(() => {
   const fetchAppointments = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fixed the URL - removed curly braces and used proper string concatenation
        const response = await axios.get(`${API_BASE_URL}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
      
        });
        
        // Transform API data to match our frontend structure
        const transformedData = response.data.map((appointment: any) => ({
          id: appointment.id,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status?.toLowerCase() || 'pending',
          location: appointment.location || "Thusha Optical Main Clinic",
          phone: appointment.phone || "Not provided",
          reason: appointment.reason || "Not specified",
          doctorDetails: {
              name: appointment.doctor_details?.name || appointment.doctor_name,
              email: appointment.doctor_details?.email || "",
              specialization: appointment.doctor_details?.specialization || appointment.doctor_specialization,
   
  }
        }));

        setAppointments(transformedData);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) { // Only fetch if user exists
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [toast, user]); // Added user to dependencies


  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      const token = sessionStorage.getItem("access_token");
      await axios.patch(
        `${API_BASE_URL}/${appointmentId}/`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? { ...app, status: "cancelled" } : app
      ));
      
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doctor Appointments</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doctor Appointments</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Doctor Appointments
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/doctor-appointment')}
        >
          Book New
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No appointments scheduled</p>
            <Button onClick={() => navigate('/doctor-appointment')}>
              Book Your First Appointment
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{appointment?.doctorDetails?.name}</h3>
                        <p className="text-sm text-muted-foreground">{appointment?.doctorDetails?.specialization}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)} variant="secondary">
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  </div>

                  {appointment.status === "pending" && (
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline">Reschedule</Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorAppointments;