
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { StaffAccountReceiverProps } from "./StaffAccountManager";

interface Appointment {
  id: string;
  customer: string;
  date: string;
  time: string;
  status: string;
  doctor: string;
}

interface AppointmentsTableProps extends StaffAccountReceiverProps {
  appointments: Appointment[];
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: string) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

// Add propTypes to help with dynamic prop checking
const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ 
  appointments, 
  onUpdateAppointmentStatus, 
  onDeleteAppointment 
}) => {
  const { user } = useUser();
  const isDoctor = user?.role === "doctor";
  
  // Function to get badge variant based on appointment status
  const getAppointmentBadgeVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "scheduled": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Management</CardTitle>
        <CardDescription>
          {isDoctor 
            ? "Manage doctor appointments and scheduling" 
            : "View doctor appointments and scheduling"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  {isDoctor && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>{apt.id}</TableCell>
                    <TableCell>{apt.customer}</TableCell>
                    <TableCell>{apt.date}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell>{apt.doctor}</TableCell>
                    <TableCell>
                      <Badge variant={getAppointmentBadgeVariant(apt.status)}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    {isDoctor && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">Update</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onUpdateAppointmentStatus(apt.id, "completed")}>
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateAppointmentStatus(apt.id, "scheduled")}>
                              Mark as Scheduled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateAppointmentStatus(apt.id, "cancelled")}>
                              Cancel Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteAppointment(apt.id)} className="text-destructive">
                              Delete Appointment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Add static propTypes to help with dynamic prop checking
AppointmentsTable.propTypes = {
  onCreateStaffAccount: () => null
};

export default AppointmentsTable;
