import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { CalendarDays, FileText, Briefcase, Award, User, Clock, Eye, Info, ClipboardCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Prescription {
  id: string
  prescription_id:string;
  patient_name: string
  date?: string
  date_issued?: string
  doctor_name?: string
  right_sphere?: string
  right_cylinder?: string
  right_axis?: string
  left_sphere?: string
  left_cylinder?: string
  left_axis?: string
  pupillary_distance?: number | string
  details?: string
}

interface Appointment {
  id: string
  patient_name: string
  date: string
  time: string
  patient_email: string
  reason: string
  type: string
  status: string
}

interface DoctorProfile {
  experience_years?: number | string
  specialization?: string[] | string
  qualifications?: string
}

interface DoctorOverviewProps {
  appointments: Appointment[]
  prescriptions: Prescription[]
  doctorProfile: DoctorProfile
  onViewAppointment: (id: string) => void
  selectedAppointment: Appointment | null
  showAppointmentDialog: boolean
  setShowAppointmentDialog: (open: boolean) => void
}

const DoctorOverview = ({
  appointments,
  prescriptions,
  doctorProfile,
  onViewAppointment,
  selectedAppointment,
  showAppointmentDialog,
  setShowAppointmentDialog,
}: DoctorOverviewProps) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false)

  const handleViewPrescriptionDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setPrescriptionDialogOpen(true)
  }

  // Map "confirmed" to "Scheduled"
  const getDisplayStatus = (status: string) =>
    status.toLowerCase() === "confirmed" ? "Scheduled" : status.charAt(0).toUpperCase() + status.slice(1)

  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase()
    if (lower === "confirmed" || lower === "scheduled")
      return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-sm"
    if (lower === "completed")
      return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm"
    if (lower === "cancelled") return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300 shadow-sm"
    return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300 shadow-sm"
  }

  const formatDoctorName = (name?: string | null) => {
    if (!name || name.trim() === "") return "Dr. Unknown"
    return name.startsWith("Dr.") ? name : `Dr. ${name}`
  }

  const getNumberColor = (value: string | null | undefined) => {
    if (!value) return {}
    const number = Number.parseFloat(value)
    if (isNaN(number)) return {}
    if (number < 0) return { color: "#dc2626" }
    if (number > 0) return { color: "#16a34a" }
    return {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-yellow-50/30 shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Appointments</CardTitle>
            <CalendarDays className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{appointments.length}</div>
            <p className="text-xs text-gray-500 mt-1">All scheduled appointments</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-amber-50/30 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Prescriptions Issued</CardTitle>
            <FileText className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{prescriptions.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total prescriptions created</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-orange-50/30 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Experience</CardTitle>
            <Briefcase className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{doctorProfile.experience_years ?? "-"}</div>
            <p className="text-xs text-gray-500 mt-1">Years in practice</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-yellow-50/30 shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Specializations</CardTitle>
            <Award className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900">
              {Array.isArray(doctorProfile.specialization)
                ? doctorProfile.specialization.join(", ")
                : typeof doctorProfile.specialization === "string" && doctorProfile.specialization.trim() !== ""
                  ? doctorProfile.specialization
                  : "None"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Specialization Areas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-3 font-bold">
              <div className="p-2 bg-white/20 rounded-full">
                <CalendarDays className="h-5 w-5" />
              </div>
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-inner">
                <CalendarDays className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-800">No appointments scheduled</p>
                <p className="text-gray-600 mt-1">Check back later for new appointments.</p>
              </div>
            ) : (
              <ul className="list-none space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <li
                    key={appointment.id}
                    className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <User className="h-4 w-4 text-amber-600" />
                          {appointment.patient_name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          {appointment.date} at {appointment.time}
                        </p>
                        <Badge className={`mt-2 ${getStatusBadge(appointment.status)}`}>
                          {getDisplayStatus(appointment.status)}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewAppointment(appointment.id)}
                        className="bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800 hover:from-yellow-200 hover:to-amber-200 hover:border-yellow-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-3 font-bold">
              <div className="p-2 bg-white/20 rounded-full">
                <FileText className="h-5 w-5" />
              </div>
              Recent Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {prescriptions.length === 0 ? (
              <div className="text-center py-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-inner">
                <FileText className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-800">No prescriptions issued</p>
                <p className="text-gray-600 mt-1">Create a new prescription to see it here.</p>
              </div>
            ) : (
              <ul className="list-none space-y-4">
                {prescriptions.slice(0, 3).map((prescription) => (
                  <li
                    key={prescription.prescription_id}
                    className="bg-gradient-to-br from-white to-amber-50/30 border border-amber-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <User className="h-4 w-4 text-orange-600" />
                          {prescription.patient_name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          Issued on{" "}
                          {prescription.date_issued
                            ? new Date(prescription.date_issued).toISOString().split("T")[0]
                            : prescription.date
                              ? new Date(prescription.date).toISOString().split("T")[0]
                              : "-"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">ID: {prescription.prescription_id}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPrescriptionDetails(prescription)}
                        className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 text-amber-800 hover:from-amber-200 hover:to-orange-200 hover:border-amber-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

       
       {/* Prescription Details Dialog */}
<Dialog open={prescriptionDialogOpen} onOpenChange={setPrescriptionDialogOpen}>
  <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-yellow-50/30 p-0 rounded-xl shadow-2xl">
    <DialogHeader className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white p-4 rounded-t-xl">
      <DialogTitle className="text-xl flex items-center gap-2 font-bold">
        <FileText className="h-5 w-5" />
        Prescription Details
      </DialogTitle>
    </DialogHeader>
    {selectedPrescription && (
      <div className="p-4 space-y-3">
        {/* Compact Grid Layout */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/70 p-2 rounded border border-yellow-200">
            <h3 className="text-xs font-medium text-gray-500">Prescription ID</h3>
            <p className="text-sm font-semibold">{selectedPrescription.prescription_id}</p>
          </div>
          <div className="bg-white/70 p-2 rounded border border-amber-200">
            <h3 className="text-xs font-medium text-gray-500">Patient</h3>
            <p className="text-sm font-semibold">{selectedPrescription.patient_name}</p>
          </div>
          <div className="bg-white/70 p-2 rounded border border-orange-200">
            <h3 className="text-xs font-medium text-gray-500">Date Issued</h3>
            <p className="text-sm font-semibold">
              {selectedPrescription.date_issued
                ? new Date(selectedPrescription.date_issued).toISOString().split("T")[0]
                : selectedPrescription.date
                  ? new Date(selectedPrescription.date).toISOString().split("T")[0]
                  : "-"}
            </p>
          </div>
          <div className="bg-white/70 p-2 rounded border border-yellow-200">
            <h3 className="text-xs font-medium text-gray-500">Doctor</h3>
            <p className="text-sm font-semibold">
              {formatDoctorName(selectedPrescription.doctor_name)}
            </p>
          </div>
        </div>

        {/* Compact Eye Prescription Layout */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-3 rounded border border-yellow-200">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Prescription Values</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1 text-gray-700">Right Eye (OD)</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sphere:</span>
                  <span className="font-medium" style={getNumberColor(selectedPrescription.right_sphere)}>
                    {selectedPrescription.right_sphere ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cylinder:</span>
                  <span className="font-medium" style={getNumberColor(selectedPrescription.right_cylinder)}>
                    {selectedPrescription.right_cylinder ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Axis:</span>
                  <span className="font-medium" style={getNumberColor(selectedPrescription.right_axis)}>
                    {selectedPrescription.right_axis ?? "-"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1 text-gray-700">Left Eye (OS)</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sphere:</span>
                  <span className="font-medium" style={getNumberColor(selectedPrescription.left_sphere)}>
                    {selectedPrescription.left_sphere ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cylinder:</span>
                  <span className="font-medium" style={getNumberColor(selectedPrescription.left_cylinder)}>
                    {selectedPrescription.left_cylinder ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Axis:</span>
                  <span className="font-medium" style={getNumberColor(selectedPrescription.left_axis)}>
                    {selectedPrescription.left_axis ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-yellow-100 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Pupillary Distance:</span>
              <span className="font-medium">
                {selectedPrescription.pupillary_distance ?? "-"}mm
              </span>
            </div>
          </div>
        </div>

        {selectedPrescription.details && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded border border-amber-200">
            <h4 className="font-semibold text-sm mb-1 text-gray-800">Additional Notes</h4>
            <p className="text-xs text-gray-700">{selectedPrescription.details}</p>
          </div>
        )}
      </div>
    )}
  </DialogContent>
</Dialog>
       {/* Appointment Details Dialog */}
<Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
  <DialogContent className="max-w-md bg-gradient-to-br from-white to-yellow-50/30 p-0 rounded-xl shadow-2xl">
    <DialogHeader className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white p-4 rounded-t-xl">
      <DialogTitle className="text-xl flex items-center gap-2 font-bold">
        <Info className="h-5 w-5" />
        Appointment Details
      </DialogTitle>
    </DialogHeader>
    {selectedAppointment && (
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/70 p-2 rounded border border-yellow-200">
            <h3 className="text-xs font-medium text-gray-500">Appointment ID</h3>
            <p className="text-sm font-semibold">{selectedAppointment.id}</p>
          </div>
          <div className="bg-white/70 p-2 rounded border border-amber-200">
            <h3 className="text-xs font-medium text-gray-500">Status</h3>
            <Badge className={`text-xs ${getStatusBadge(selectedAppointment.status)}`}>
              {getDisplayStatus(selectedAppointment.status)}
            </Badge>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-3 rounded border border-yellow-200">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Patient Information</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{selectedAppointment.patient_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{selectedAppointment.patient_email}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded border border-amber-200">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Appointment Details</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{selectedAppointment.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{selectedAppointment.time}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Reason:</span>
              <span className="font-medium text-right">{selectedAppointment.reason}</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  )
}

export default DoctorOverview