import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, CalendarDays, Search, Eye, Info, ClipboardCheck, Ban } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DoctorAppointmentsTabProps {
  appointments: any[]
  onViewAppointment: (id: string) => void
  onUpdateAppointmentStatus: (id: string, status: "completed" | "cancelled") => Promise<void>
}

const DoctorAppointmentsTab = ({
  appointments,
  onViewAppointment,
  onUpdateAppointmentStatus,
}: DoctorAppointmentsTabProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleViewAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setAppointmentDialogOpen(true)
  }

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      setIsLoading(true)
      await onUpdateAppointmentStatus(appointmentId, "completed")
    } catch (err) {
      setError("Failed to complete appointment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setIsLoading(true)
      await onUpdateAppointmentStatus(appointmentId, "cancelled")
    } catch (err) {
      setError("Failed to cancel appointment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (type: string, status?: string) => {
    if (status === "completed")
      return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm"
    if (status === "cancelled") return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300 shadow-sm"

    const statusColors: { [key: string]: string } = {
      "Check-up": "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300",
      Consultation: "bg-gradient-to-r from-green-100 to-lime-100 text-green-800 border-green-300",
      "Follow-up": "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300",
      Emergency: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300",
      "Surgery Consultation": "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-800 border-purple-300",
      confirmed: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300",
      scheduled: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300",
    }
    return statusColors[type] || "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300"
  }

  const getStatusText = (appointment: any) => {
    if (!appointment.status) return appointment.type
    const status = appointment.status.toLowerCase()
    if (status === "confirmed" || status === "scheduled") {
      return "Scheduled"
    }
    return appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
  }

  const getStatusForFilter = (status?: string) => {
    if (!status) return ""
    const lowerStatus = status.toLowerCase()
    return lowerStatus === "confirmed" ? "scheduled" : lowerStatus
  }

  const canManageAppointment = (appointment: any) => {
    const status = appointment.status?.toLowerCase()
    return !status || status === "confirmed" || status === "scheduled"
  }

  const parseTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number)
    return hour * 60 + minute
  }

  const filteredAppointments = appointments
    .filter((appointment) => {
      const query = searchTerm.toLowerCase()
      const statusText = getStatusForFilter(appointment.status)
      return (
        appointment.patient_email?.toLowerCase().includes(query) ||
        appointment.patient_name?.toLowerCase().includes(query) ||
        appointment.date?.toLowerCase().includes(query) ||
        statusText?.includes(query)
     ) })
    .sort((a, b) => {
      const statusA = a.status?.toLowerCase() === "confirmed" ? 0 : 1
      const statusB = b.status?.toLowerCase() === "confirmed" ? 0 : 1
      if (statusA !== statusB) return statusA - statusB
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return parseTime(a.time) - parseTime(b.time)
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4">
      <Card className="max-w-7xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-3 font-bold">
            <div className="p-2 bg-white/20 rounded-full">
              <CalendarDays className="h-6 w-6" />
            </div>
            All Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex justify-end mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search appointments..."
                className="w-full pl-10 pr-4 py-2 border border-yellow-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/70 transition-all duration-200"
              />
            </div>
          </div>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-inner">
              <CalendarDays className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-800">No appointments found</p>
              <p className="text-gray-600 mt-2">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-yellow-200 shadow-lg">
              <Table className="min-w-full bg-white/70">
                <TableHeader className="bg-gradient-to-r from-yellow-100 to-amber-100">
                  <TableRow className="border-b border-yellow-200">
                    <TableHead className="py-3 px-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Patient Email
                    </TableHead>
                    <TableHead className="py-3 px-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Patient Name
                    </TableHead>
                    <TableHead className="py-3 px-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="py-3 px-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Time
                    </TableHead>
                    <TableHead className="py-3 px-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Type/Status
                    </TableHead>
                    <TableHead className="py-3 px-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow
                      key={appointment.id}
                      className="border-b border-yellow-100 hover:bg-yellow-50/50 transition-colors duration-200"
                    >
                      <TableCell className="py-3 px-4 text-sm text-gray-700">{appointment.patient_email}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-gray-700">{appointment.patient_name}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-gray-700">{appointment.date}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-gray-700">{appointment.time}</TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge className={getStatusBadge(appointment.type, appointment.status)}>
                          {getStatusText(appointment)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAppointmentDetails(appointment)}
                            className="bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800 hover:from-yellow-200 hover:to-amber-200 hover:border-yellow-400 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {canManageAppointment(appointment) && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800 hover:from-green-200 hover:to-emerald-200 hover:border-green-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border-yellow-200">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                      <ClipboardCheck className="h-6 w-6 text-green-600" />
                                      Complete Appointment
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-600">
                                      Are you sure you want to mark this appointment as completed? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-full px-6 py-2">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCompleteAppointment(appointment.id)}
                                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-6 py-2 shadow-md"
                                    >
                                      Mark Complete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gradient-to-r from-red-100 to-rose-100 border-red-300 text-red-800 hover:from-red-200 hover:to-rose-200 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border-yellow-200">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                      <Ban className="h-6 w-6 text-red-600" />
                                      Cancel Appointment
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-600">
                                      Are you sure you want to cancel this appointment? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-full px-6 py-2">
                                      Keep Appointment
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-full px-6 py-2 shadow-md"
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-yellow-50/30 p-0 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white p-4 rounded-t-xl sticky top-0 z-10">
            <DialogTitle className="text-xl flex items-center gap-2 font-bold">
              <div className="p-1 bg-white/20 rounded-full">
                <Info className="h-5 w-5" />
              </div>
              Appointment Details
            </DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/70 p-3 rounded-lg border border-yellow-200 shadow-sm">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Appointment ID</h3>
                  <p className="font-mono text-sm font-semibold text-gray-800 truncate">{selectedAppointment.id}</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg border border-amber-200 shadow-sm">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</h3>
                  <Badge className={`text-xs ${getStatusBadge(selectedAppointment.type, selectedAppointment.status)}`}>
                    {getStatusText(selectedAppointment)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/70 p-3 rounded-lg border border-orange-200 shadow-sm">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Patient Name</h3>
                  <p className="text-sm font-semibold text-gray-800">{selectedAppointment.patient_name}</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg border border-yellow-200 shadow-sm">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date & Time</h3>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-gray-800 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-yellow-600" />
                  Appointment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded">
                    <span className="text-gray-600 font-medium">Scheduled Date:</span>
                    <span className="font-semibold text-gray-800">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded">
                    <span className="text-gray-600 font-medium">Scheduled Time:</span>
                    <span className="font-semibold text-gray-800">{selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded">
                    <span className="text-gray-600 font-medium">Reason:</span>
                    <span className="font-semibold text-gray-800">{selectedAppointment.reason}</span>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="pt-2 border-t border-yellow-100 mt-2">
                      <span className="text-gray-600 font-medium">Notes:</span>
                      <p className="mt-1 text-gray-800 bg-white/70 p-2 rounded text-sm">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 sticky bottom-0 bg-white/80 p-2 rounded-b-xl">
                <Button
                  variant="outline"
                  onClick={() => setAppointmentDialogOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-full px-4 py-1 text-sm h-8 shadow-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DoctorAppointmentsTab