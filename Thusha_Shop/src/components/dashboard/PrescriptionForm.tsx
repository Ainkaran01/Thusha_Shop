import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Eye, User, Mail, Plus, X, Save } from "lucide-react"

interface PrescriptionFormProps {
  newPrescription: any
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onEyeValueChange: (eye: "rightEye" | "leftEye", field: string, value: number) => void
  onSave: () => void
  onCancel: () => void
  onPupillaryDistanceChange: (value: number) => void
  onSelectPatientEmail: (value: string) => void
  confirmedPatients: string[]
}

const PrescriptionForm = ({
  newPrescription,
  onInputChange,
  onEyeValueChange,
  onSave,
  onCancel,
  onPupillaryDistanceChange,
  confirmedPatients,
  onSelectPatientEmail,
}: PrescriptionFormProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white max-w-4xl w-full max-h-[95vh] rounded-xl shadow-xl flex flex-col overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white p-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Plus className="h-5 w-5" /> New Prescription
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-yellow-50/30 via-white to-amber-50/30 flex-1">
          {/* Patient Selection */}
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-yellow-600" />
              <Label className="font-medium">Patient Email</Label>
            </div>
            <Select onValueChange={onSelectPatientEmail}>
              <SelectTrigger className="h-10 text-sm bg-white border-yellow-300 focus:ring-yellow-400">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {confirmedPatients.length > 0 ? (
                  [...new Set(confirmedPatients)].map((email) => (
                    <SelectItem key={email} value={email} className="text-sm">
                      <User className="h-3 w-3 text-yellow-600 mr-1" />
                      {email}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-gray-500 text-xs px-2 py-1">No confirmed patients</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Eye Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Right Eye */}
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                <Eye className="h-4 w-4 text-amber-600" />
                Right Eye (OD)
              </div>
              {["sphere", "cylinder", "axis"].map((field) => (
                <div key={field}>
                  <Label className="text-xs capitalize">{field}</Label>
                  <Input
                    type="number"
                    step={field === "axis" ? "1" : "0.25"}
                    min={field === "axis" ? 1 : undefined}
                    max={field === "axis" ? 180 : undefined}
                    value={newPrescription.rightEye[field]}
                    onChange={(e) =>
                      onEyeValueChange("rightEye", field, parseFloat(e.target.value))
                    }
                    className="h-9 text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Left Eye */}
            <div className="bg-orange-50 p-4 rounded-md border border-orange-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                <Eye className="h-4 w-4 text-orange-600" />
                Left Eye (OS)
              </div>
              {["sphere", "cylinder", "axis"].map((field) => (
                <div key={field}>
                  <Label className="text-xs capitalize">{field}</Label>
                  <Input
                    type="number"
                    step={field === "axis" ? "1" : "0.25"}
                    min={field === "axis" ? 1 : undefined}
                    max={field === "axis" ? 180 : undefined}
                    value={newPrescription.leftEye[field]}
                    onChange={(e) =>
                      onEyeValueChange("leftEye", field, parseFloat(e.target.value))
                    }
                    className="h-9 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* PD and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 shadow-sm">
              <Label className="text-sm font-medium">Pupillary Distance (PD)</Label>
              <Input
                type="number"
                value={newPrescription.pupillaryDistance}
                onChange={(e) => onPupillaryDistanceChange(parseFloat(e.target.value))}
                className="h-9 text-sm"
                placeholder="PD"
              />
            </div>
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 shadow-sm">
              <Label className="text-sm font-medium">Additional Notes</Label>
              <Textarea
                name="details"
                rows={3}
                value={newPrescription.details}
                onChange={onInputChange}
                className="text-sm resize-none h-[70px]"
                placeholder="Notes..."
              />
            </div>
          </div>
        </CardContent>

        {/* Footer Buttons */}
        <CardFooter className="bg-white border-t border-yellow-100 p-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full px-6 py-2 text-sm font-semibold"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white rounded-full px-6 py-2 text-sm font-semibold"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}

export default PrescriptionForm