
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  
  // Mock appointment data - in real app this would come from API
  const appointments = [
    {
      id: 1,
      doctorName: "Dr. Emily Wilson",
      specialty: "Optometrist",
      date: "2024-06-10",
      time: "10:30 AM",
      status: "confirmed",
      location: "VisionCraft Main Clinic",
      phone: "(555) 123-4567",
      reason: "Regular eye examination"
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialty: "Ophthalmologist", 
      date: "2024-05-28",
      time: "02:00 PM",
      status: "completed",
      location: "VisionCraft Eye Center",
      phone: "(555) 987-6543",
      reason: "Follow-up consultation"
    },
    {
      id: 3,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Optometrist",
      date: "2024-06-15",
      time: "09:00 AM", 
      status: "pending",
      location: "VisionCraft Main Clinic",
      phone: "(555) 456-7890",
      reason: "Vision test and prescription update"
    },
    {
      id: 4,
      doctorName: "Dr. Robert Martinez",
      specialty: "Ophthalmologist",
      date: "2024-04-20",
      time: "11:00 AM",
      status: "completed",
      location: "VisionCraft Eye Center",
      phone: "(555) 789-0123",
      reason: "Cataract consultation"
    },
    {
      id: 5,
      doctorName: "Dr. Lisa Thompson",
      specialty: "Optometrist",
      date: "2024-03-15",
      time: "03:30 PM",
      status: "completed",
      location: "VisionCraft Main Clinic",
      phone: "(555) 234-5678",
      reason: "Contact lens fitting"
    }
  ];

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
                        <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
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
                      <Button size="sm" variant="outline">Cancel</Button>
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