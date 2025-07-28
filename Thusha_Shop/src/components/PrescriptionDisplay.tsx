import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Prescription } from "@/types/user";
import UpdatePrescription from "./dashboard/UpdatePrescription";

interface PrescriptionDisplayProps {
  prescriptions: Prescription[];
  title?: string;
  onRefreshPrescriptions?: () => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDoctorName = (name?: string | null) => {
  if (!name || name.trim() === "") return "Dr. Unknown";
  return name.startsWith("Dr.") ? name : `Dr. ${name}`;
};

const getNumberColor = (value: string | null | undefined) => {
  if (!value) return {};
  const number = parseFloat(value);
  if (isNaN(number)) return {};
  if (number < 0) return { color: "#dc2626" }; // red-600
  if (number > 0) return { color: "#16a34a" }; // green-600
  return {};
};

const PrescriptionDisplay: React.FC<PrescriptionDisplayProps> = ({
  prescriptions,
  title = "My Prescriptions",
  onRefreshPrescriptions,
}) => {
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [prescriptionToUpdate, setPrescriptionToUpdate] =
    useState<Prescription | null>(null);
  const [sortedPrescriptions, setSortedPrescriptions] = useState<{
    active: Prescription[];
    expired: Prescription[];
  }>({ active: [], expired: [] });

  useEffect(() => {
    if (prescriptions) {
      const now = new Date();
      const sorted = prescriptions.reduce(
        (acc, prescription) => {
          const isExpired =
            prescription.status.toLowerCase() === "expired" ||
            (prescription.expiry_date &&
              new Date(prescription.expiry_date) < now);

          if (isExpired) {
            acc.expired.push(prescription);
          } else {
            acc.active.push(prescription);
          }
          return acc;
        },
        { active: [] as Prescription[], expired: [] as Prescription[] }
      );

      // Sort active prescriptions by date (newest first)
      sorted.active.sort((a, b) => {
        const dateA = a.date_issued ? new Date(a.date_issued).getTime() : 0;
        const dateB = b.date_issued ? new Date(b.date_issued).getTime() : 0;
        return dateB - dateA;
      });

      // Sort expired prescriptions by expiry date (most recently expired first)
      sorted.expired.sort((a, b) => {
        const dateA = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
        const dateB = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
        return dateB - dateA;
      });

      setSortedPrescriptions(sorted);
    }
  }, [prescriptions]);

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
  };

  const handleOpenUpdateDialog = (prescription: Prescription) => {
    setPrescriptionToUpdate(prescription);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    setUpdateDialogOpen(false);
    setPrescriptionToUpdate(null);
    if (onRefreshPrescriptions) {
      onRefreshPrescriptions();
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5 text-gray-900" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-amber-100 rounded-full">
                <FileText className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No prescriptions available
              </h3>
              <p className="text-sm text-gray-700">
                Visit an optometrist to get a prescription for your eyewear
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader className="border-b border-amber-200">
          <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
            <FileText className="h-5 w-5 text-gray-900" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Prescriptions Section */}
          {sortedPrescriptions.active.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  Active Prescriptions
                </h3>
                <Badge className="bg-green-100 text-green-800">
                  {sortedPrescriptions.active.length} active
                </Badge>
              </div>
              <div className="space-y-4">
                {sortedPrescriptions.active.map((prescription) => (
                  <PrescriptionItem
                    key={prescription.id}
                    prescription={prescription}
                    onView={handleViewPrescription}
                    onUpdate={handleOpenUpdateDialog}
                    renderStatusBadge={renderStatusBadge}
                    formatDate={formatDate}
                    formatDoctorName={formatDoctorName}
                    getNumberColor={getNumberColor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Expired Prescriptions Section */}
          {sortedPrescriptions.expired.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <div className="p-1 bg-red-100 rounded-full">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  Expired Prescriptions
                </h3>
                <Badge className="bg-red-100 text-red-800">
                  {sortedPrescriptions.expired.length} expired
                </Badge>
              </div>
              <div className="space-y-4 opacity-80">
                {sortedPrescriptions.expired.map((prescription) => (
                  <PrescriptionItem
                    key={prescription.id}
                    prescription={prescription}
                    onView={handleViewPrescription}
                    renderStatusBadge={renderStatusBadge}
                    formatDate={formatDate}
                    formatDoctorName={formatDoctorName}
                    getNumberColor={getNumberColor}
                    isExpired={true}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Prescription ID</h3>
                  <p>{selectedPrescription.prescription_id}</p>
                </div>
                <div>
                  <h3 className="font-medium">Date Issued</h3>
                  <p>{formatDate(selectedPrescription.date_issued)}</p>
                </div>
                <div>
                  <h3 className="font-medium">Patient Name</h3>
                  <p>{selectedPrescription.patient_name ?? "Not specified"}</p>
                </div>

                <div>
                  <h3 className="font-medium">Patient Email</h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedPrescription.patient_email_display ??
                      "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Doctor</h3>
                <p>{formatDoctorName(selectedPrescription.doctor_name)}</p>
              </div>

              <div className="border rounded-md p-4 bg-amber-50">
                <h3 className="font-medium mb-4 text-primary">
                  Prescription Values
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Right Eye (OD)</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Sphere</td>
                          <td
                            className="py-2 text-right"
                            style={getNumberColor(
                              selectedPrescription.right_sphere
                            )}
                          >
                            {selectedPrescription.right_sphere ?? "N/A"}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">
                            Cylinder
                          </td>
                          <td
                            className="py-2 text-right"
                            style={getNumberColor(
                              selectedPrescription.right_cylinder
                            )}
                          >
                            {selectedPrescription.right_cylinder ?? "N/A"}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Axis</td>
                          <td
                            className="py-2 text-right"
                            style={getNumberColor(
                              selectedPrescription.right_axis
                            )}
                          >
                            {selectedPrescription.right_axis ?? "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground">PD</td>
                          <td className="py-2 text-right">
                            {selectedPrescription.pupillary_distance
                              ? selectedPrescription.pupillary_distance / 2
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Left Eye (OS)</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Sphere</td>
                          <td
                            className="py-2 text-right"
                            style={getNumberColor(
                              selectedPrescription.left_sphere
                            )}
                          >
                            {selectedPrescription.left_sphere ?? "N/A"}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">
                            Cylinder
                          </td>
                          <td
                            className="py-2 text-right"
                            style={getNumberColor(
                              selectedPrescription.left_cylinder
                            )}
                          >
                            {selectedPrescription.left_cylinder ?? "N/A"}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-muted-foreground">Axis</td>
                          <td
                            className="py-2 text-right"
                            style={getNumberColor(
                              selectedPrescription.left_axis
                            )}
                          >
                            {selectedPrescription.left_axis ?? "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground">PD</td>
                          <td className="py-2 text-right">
                            {selectedPrescription.pupillary_distance
                              ? selectedPrescription.pupillary_distance / 2
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="text-sm bg-muted/50 p-3 rounded-md">
                {selectedPrescription.status.toLowerCase() === "expired" ? (
                  <p className="text-red-600 font-semibold">
                    This prescription expired on{" "}
                    {formatDate(selectedPrescription.expiry_date)}.
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    This prescription was created on{" "}
                    {formatDate(selectedPrescription.date_issued)} and expires
                    on {formatDate(selectedPrescription.expiry_date)}.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

     <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
  <DialogContent className="max-w-md bg-gradient-to-br from-white to-yellow-50/30 p-0 rounded-xl shadow-2xl border-yellow-200/50">
    <DialogHeader className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white p-4 rounded-t-xl">
      <DialogTitle className="text-lg font-bold flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Update Prescription
      </DialogTitle>
    </DialogHeader>
    {prescriptionToUpdate && (
      <div className="p-4">
        <UpdatePrescription 
          prescription={prescriptionToUpdate} 
          onUpdateSuccess={handleUpdateSuccess} 
        />
      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
};

interface PrescriptionItemProps {
  prescription: Prescription;
  onView: (prescription: Prescription) => void;
  onUpdate?: (prescription: Prescription) => void;
  renderStatusBadge: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
  formatDoctorName: (name?: string | null) => string;
  getNumberColor: (value: string | null | undefined) => React.CSSProperties;
  isExpired?: boolean;
}

const PrescriptionItem: React.FC<PrescriptionItemProps> = ({
  prescription,
  onView,
  onUpdate,
  renderStatusBadge,
  formatDate,
  formatDoctorName,
  getNumberColor,
  isExpired = false,
}) => {
  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${
        isExpired ? "border-amber-200" : "border-amber-300"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <div
            className={`p-2 rounded-full ${
              isExpired ? "bg-amber-100" : "bg-amber-100"
            }`}
          >
            <FileText
              className={`h-4 w-4 ${
                isExpired ? "text-gray-900" : "text-gray-900"
              }`}
            />
          </div>
          <span className="font-medium text-gray-900">
            {prescription.prescription_id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            {formatDate(prescription.date_issued)}
          </span>
          {renderStatusBadge(prescription.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Right Eye */}
        <div
          className={`p-3 rounded-md ${
            isExpired ? "bg-amber-50" : "bg-amber-50"
          }`}
        >
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-gray-900">
            <Eye className="h-4 w-4 text-gray-900" /> Right Eye (OD)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-700">Sphere (SPH)</p>
              <p style={getNumberColor(prescription.right_sphere)}>
                {prescription.right_sphere ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">Cylinder (CYL)</p>
              <p style={getNumberColor(prescription.right_cylinder)}>
                {prescription.right_cylinder ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">Axis</p>
              <p style={getNumberColor(prescription.right_axis)}>
                {prescription.right_axis ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">PD</p>
              <p>
                {prescription.pupillary_distance
                  ? prescription.pupillary_distance / 2
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Left Eye */}
        <div
          className={`p-3 rounded-md ${
            isExpired ? "bg-amber-50" : "bg-amber-50"
          }`}
        >
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-gray-900">
            <Eye className="h-4 w-4 text-gray-900" /> Left Eye (OS)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-700">Sphere (SPH)</p>
              <p style={getNumberColor(prescription.left_sphere)}>
                {prescription.left_sphere ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">Cylinder (CYL)</p>
              <p style={getNumberColor(prescription.left_cylinder)}>
                {prescription.left_cylinder ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">Axis</p>
              <p style={getNumberColor(prescription.left_axis)}>
                {prescription.left_axis ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">PD</p>
              <p>
                {prescription.pupillary_distance
                  ? prescription.pupillary_distance / 2
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          <div>
            <span className="text-gray-700">Patient:</span>{" "}
            {prescription.patient_name}
          </div>
          {prescription.patient_email_display && (
            <div className="text-gray-600 text-xs">
              {prescription.patient_email_display}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(prescription)}
            className="text-gray-900 border-amber-300 hover:bg-amber-50"
          >
            View Details
          </Button>

          {!isExpired && onUpdate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate(prescription)}
              className="text-gray-900 border-amber-300 hover:bg-amber-50"
            >
              Update
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDisplay;
