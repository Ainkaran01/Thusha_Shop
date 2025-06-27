import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { StaffAccountReceiverProps } from "./StaffAccountManager";

interface Appointment {
  id: number;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  doctor_name: string;
  patient_email :string;
  reason: string;
  phone: string;
  created_at: string;
  doctor_details: {
    id: number;
    name: string;
    email: string;
    specialization: string;
    availability: string[];
  };
}

interface AppointmentsTableProps extends StaffAccountReceiverProps {
  appointments: Appointment[];
  onDeleteAppointment: (id: number) => void;
}

// Add propTypes to help with dynamic prop checking
const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onDeleteAppointment,
}) => {
  const { user } = useUser();

  const [selectedAppointment, setSelectedAppointment] =
    React.useState<Appointment | null>(null);

  // Function to get badge variant based on appointment status
  const getAppointmentBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "scheduled":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Management</CardTitle>
        <CardDescription></CardDescription>
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
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>{apt.id}</TableCell>
                    <TableCell>{apt.patient_name}</TableCell>
                    <TableCell>{apt.date}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell>{apt.doctor_name}</TableCell>
                    <TableCell>
                      <Badge variant={getAppointmentBadgeVariant(apt.status)}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedAppointment(apt)}
                          >
                            <Eye className="h-4 w-4 text-green-600 hover:text-green-700 transition-colors" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl bg-white p-6">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-900 mb-1">
                              Appointment Details
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                              Review complete information of the selected
                              appointment.
                            </DialogDescription>
                          </DialogHeader>

                          {selectedAppointment && (
                            <div className="grid grid-cols-1 gap-4 mt-4 text-sm text-gray-800">
                              {/* Appointment Info Section */}
                              <div>
                                <h3 className="text-base font-semibold text-gray-700 mb-2 border-b pb-1">
                                  Appointment Info
                                </h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                  <div>
                                    <strong>ID:</strong>{" "}
                                    {selectedAppointment.id}
                                  </div>
                                  <div>
                                    <strong>Status:</strong>
                                    <span className="ml-1 capitalize px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                                      {selectedAppointment.status}
                                    </span>
                                  </div>
                                  <div>
                                    <strong>Date:</strong>{" "}
                                    {selectedAppointment.date}
                                  </div>
                                  <div>
                                    <strong>Time:</strong>{" "}
                                    {selectedAppointment.time}
                                  </div>
                                  <div className="col-span-2">
                                    <strong>Reason:</strong>{" "}
                                    {selectedAppointment.reason}
                                  </div>
                                </div>
                              </div>

                              {/* Patient Info Section */}
                              <div>
                                <h3 className="text-base font-semibold text-gray-700 mb-2 border-b pb-1">
                                  Patient Info
                                </h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                                  <div>
                                    <strong>Name:</strong>{" "}
                                    {selectedAppointment.patient_name}
                                  </div>
                                  <div>
                                    <strong>Phone:</strong>{" "}
                                    {selectedAppointment.phone}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                  <div>
                                    <strong>Email:</strong>{" "}
                                    {selectedAppointment.patient_email}
                                  </div>
                                </div>
                              </div>

                              {/* Doctor Info Section */}
                              <div>
                                <h3 className="text-base font-semibold text-gray-700 mb-2 border-b pb-1">
                                  Doctor Info
                                </h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                  <div>
                                    <strong>Name:</strong>{" "}
                                    {selectedAppointment.doctor_name}
                                  </div>
                                  <div>
                                    <strong>Email:</strong>{" "}
                                    {selectedAppointment.doctor_details.email}
                                  </div>
                                  <div className="col-span-2">
                                    <strong>Specialization:</strong>{" "}
                                    {
                                      selectedAppointment.doctor_details
                                        .specialization
                                    }
                                  </div>
                                  <div className="col-span-2">
                                    <strong>Availability:</strong>{" "}
                                    {selectedAppointment.doctor_details.availability.join(
                                      ", "
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
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
  onCreateStaffAccount: () => null,
};

export default AppointmentsTable;
