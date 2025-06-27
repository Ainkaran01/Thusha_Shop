
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import { AlertCircle } from "lucide-react";

interface Appointment {
  id: number;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  doctor_name: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onViewAllAppointments: () => void;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ 
  appointments, 
  onViewAllAppointments 
}) => {
  const { user } = useUser();
  const isDoctor = user?.role === "doctor";
  const isAdmin = user?.role === "admin";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.filter(apt => apt.status === 'scheduled').slice(0, 3).map((apt) => (
            <div key={apt.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{apt.patient_name}</p>
                <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{apt.doctor_name}</p>
                <Badge variant="outline">{apt.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        
        {isAdmin && !isDoctor && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <p className="text-sm text-amber-700">
              Only doctors can manage appointments. Admins can only view appointment details.
            </p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={onViewAllAppointments}
        >
          {isDoctor ? "Manage All Appointments" : "View All Appointments"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
