import React, { useState } from "react";
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
import {
  Eye,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Stethoscope,
  Search,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Appointment {
  id: number;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  doctor_name: string;
  patient_email: string;
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

interface StaffAccountReceiverProps {
  onCreateStaffAccount?: () => void;
}

interface AppointmentsTableProps extends StaffAccountReceiverProps {
  appointments?: Appointment[];
  onDeleteAppointment?: (id: number) => void;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments = [],
  onDeleteAppointment = () => {},
}) => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("all");

  // Get unique doctors for filter dropdown
  const doctors = Array.from(
    new Set(appointments.map((apt) => apt.doctor_name))
  ).sort();

  // Filter appointments based on search term and selected doctor
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toString().includes(searchTerm);

    const matchesDoctor =
      selectedDoctor === "all" || apt.doctor_name === selectedDoctor;

    return matchesSearch && matchesDoctor;
  });

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

  // Function to get status color for enhanced styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30">
      <CardHeader className="bg-gradient-to-r to-indigo-50 border-b border-gray-100">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Appointment Management
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Manage and view all patient appointments
              </CardDescription>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, email or ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[250px]">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-4">
                    ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Time
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Doctor
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <TableRow
                      key={apt.id}
                      className="hover:bg-blue-50/30 transition-colors duration-200 border-b border-gray-100"
                    >
                      <TableCell className="py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          #{apt.id}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {apt.patient_name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <span className="font-medium text-gray-800">
                            {apt.patient_name || "Unknown Patient"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {apt.date || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {apt.time || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-medium text-gray-800">
                          {apt.doctor_name || "Unknown Doctor"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={getAppointmentBadgeVariant(apt.status)}
                          className={`${getStatusColor(
                            apt.status
                          )} font-medium px-3 py-1 text-xs border`}
                        >
                          {apt.status || "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-blue-200 transition-all duration-200 rounded-lg"
                              onClick={() => setSelectedAppointment(apt)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg shadow-xl bg-white border">
                            <DialogHeader className="pb-4 border-b">
                              <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </div>
                                Appointment Details #
                                {selectedAppointment?.id || "N/A"}
                              </DialogTitle>
                            </DialogHeader>

                            {selectedAppointment && (
                              <div className="space-y-4 pt-4">
                                {/* Appointment Info Section */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    Appointment Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Appointment ID
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border">
                                        #{selectedAppointment.id}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Status
                                      </p>
                                      <Badge
                                        className={`${getStatusColor(
                                          selectedAppointment.status
                                        )} text-xs px-3 py-1 border`}
                                      >
                                        {selectedAppointment.status}
                                      </Badge>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Date
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.date}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Time
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.time}
                                      </p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Reason for Visit
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border min-h-[60px]">
                                        {selectedAppointment.reason ||
                                          "No reason provided"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Patient Info Section */}
                                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4 text-green-600" />
                                    Patient Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Full Name
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <User className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.patient_name ||
                                          "Unknown Patient"}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Phone Number
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <Phone className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.phone ||
                                          "No phone provided"}
                                      </p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Email Address
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <Mail className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.patient_email ||
                                          "No email provided"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Doctor Info Section */}
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 text-purple-600" />
                                    Doctor Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Doctor Name
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <User className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.doctor_name ||
                                          "Unknown Doctor"}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Email
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <Mail className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.doctor_details
                                          ?.email || "No email provided"}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Specialization
                                      </p>
                                      <p className="text-sm bg-white px-3 py-2 rounded border flex items-center gap-2">
                                        <Stethoscope className="h-3 w-3 text-gray-400" />
                                        {selectedAppointment.doctor_details
                                          ?.specialization ||
                                          "No specialization provided"}
                                      </p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <p className="text-xs font-medium text-gray-600">
                                        Availability
                                      </p>
                                      <div className="text-sm bg-white px-3 py-2 rounded border">
                                        <div className="flex flex-wrap gap-2">
                                          {selectedAppointment.doctor_details
                                            ?.availability?.length > 0 ? (
                                            selectedAppointment.doctor_details.availability.map(
                                              (day, idx) => (
                                                <span
                                                  key={idx}
                                                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                                                >
                                                  {day}
                                                </span>
                                              )
                                            )
                                          ) : (
                                            <span className="text-gray-500 text-xs">
                                              No availability information
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        No appointments found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        No appointments match your search criteria
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedDoctor("all");
                        }}
                        className="text-blue-600"
                      >
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTable;
