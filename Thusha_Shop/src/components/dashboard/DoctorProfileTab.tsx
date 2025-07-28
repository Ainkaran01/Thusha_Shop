import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, GraduationCap, Calendar, Award, Briefcase, Edit3, Save, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Availability {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

interface DoctorProfile {
  name: string
  specialization: string
  experience_years: number | string
  qualifications: string
  availability: Availability | string
  biography: string
}

interface DoctorProfileTabProps {
  doctorProfile: DoctorProfile
  editingProfile: boolean
  profileForm: DoctorProfile
  onEditProfile: () => void
  onSaveProfile: () => void
  onProfileChange: (field: string, value: string | Availability) => void
  onCancelEdit: () => void
}

const DoctorProfileTab = ({
  doctorProfile,
  editingProfile,
  profileForm,
  onEditProfile,
  onSaveProfile,
  onProfileChange,
  onCancelEdit,
}: DoctorProfileTabProps) => {
  const getAvailabilityObject = (): Availability => {
    if (typeof profileForm.availability === "string") {
      try {
        return JSON.parse(profileForm.availability) as Availability
      } catch {
        return {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        }
      }
    }
    return profileForm.availability
  }

  const currentAvailability = getAvailabilityObject()

  const formatAvailability = (availability: Availability | string): string => {
    if (typeof availability === "string") {
      try {
        const parsed = JSON.parse(availability) as Availability
        return Object.entries(parsed)
          .filter(([_, isAvailable]) => isAvailable)
          .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
          .join(", ")
      } catch {
        return availability
      }
    }
    return Object.entries(availability)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(", ")
  }

  const handleAvailabilityChange = (day: keyof Availability, checked: boolean) => {
    const newAvailability = {
      ...currentAvailability,
      [day]: checked,
    }
    // Send the availability as an object instead of stringified JSON
    onProfileChange("availability", newAvailability)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4">
      <Card className="max-w-6xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white rounded-t-lg">
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-white/20 rounded-full">
                <User className="h-6 w-6" />
              </div>
              Professional Profile
            </CardTitle>
            {!editingProfile && (
              <Button
                onClick={onEditProfile}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 hover:scale-105"
                variant="outline"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {editingProfile ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-yellow-400 rounded-full">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-medium text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => onProfileChange("name", e.target.value)}
                        className="border-yellow-200 focus:border-yellow-400 h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="specialization" className="text-xs font-medium text-gray-700">
                        Specialization
                      </Label>
                      <Input
                        id="specialization"
                        value={profileForm.specialization}
                        onChange={(e) => onProfileChange("specialization", e.target.value)}
                        className="border-yellow-200 focus:border-yellow-400 h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="experience_years" className="text-xs font-medium text-gray-700">
                        Years of Experience
                      </Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={profileForm.experience_years}
                        onChange={(e) => onProfileChange("experience_years", e.target.value)}
                        className="border-yellow-200 focus:border-yellow-400 h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="qualifications" className="text-xs font-medium text-gray-700">
                        Qualifications
                      </Label>
                      <Input
                        id="qualifications"
                        value={profileForm.qualifications}
                        onChange={(e) => onProfileChange("qualifications", e.target.value)}
                        className="border-yellow-200 focus:border-yellow-400 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Availability, Biography and Actions */}
              <div className="space-y-6">
                {/* Availability Section */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-amber-400 rounded-full">
                      <Calendar className="h-3.5 w-3.5 text-white" />
                    </div>
                    Available Days
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {Object.entries(currentAvailability).map(([day, isAvailable]) => (
                      <div
                        key={day}
                        className="flex flex-col items-center space-y-1 p-2 bg-white rounded border border-amber-200"
                      >
                        <Checkbox
                          id={day}
                          checked={isAvailable}
                          onCheckedChange={(checked) =>
                            handleAvailabilityChange(day as keyof Availability, Boolean(checked))
                          }
                          className="h-4 w-4 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                        />
                        <Label htmlFor={day} className="text-xs capitalize font-medium text-gray-700 cursor-pointer">
                          {day.slice(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Biography Section */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-5 rounded-xl border border-orange-200">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-orange-400 rounded-full">
                      <GraduationCap className="h-3.5 w-3.5 text-white" />
                    </div>
                    Professional Biography
                  </h3>
                  <Textarea
                    id="biography"
                    value={profileForm.biography}
                    onChange={(e) => onProfileChange("biography", e.target.value)}
                    rows={4}
                    className="border-orange-200 focus:border-orange-400 text-sm min-h-[120px]"
                    placeholder="Tell us about your professional background..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={onSaveProfile}
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2 text-sm h-9 rounded-full w-full"
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onCancelEdit}
                      className="border-gray-300 px-6 py-2 text-sm h-9 rounded-full w-full"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-yellow-400 rounded-full">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-white rounded">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <span className="text-sm text-gray-800 font-semibold">{doctorProfile.name || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">Specialization:</span>
                      <span className="text-sm text-gray-800 font-semibold">
                        {doctorProfile.specialization || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded">
                      <Briefcase className="h-3.5 w-3.5 text-orange-500" />
                      <span className="text-sm font-medium text-gray-600">Experience:</span>
                      <span className="text-sm text-gray-800 font-semibold">
                        {doctorProfile.experience_years || "0"} years
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded">
                      <Award className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-600">Qualifications:</span>
                      <span className="text-sm text-gray-800 font-semibold">
                        {doctorProfile.qualifications || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Availability and Biography */}
              <div className="space-y-6">
                {/* Availability */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-amber-400 rounded-full">
                      <Calendar className="h-3.5 w-3.5 text-white" />
                    </div>
                    Availability
                  </h3>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-800 font-medium">
                      {formatAvailability(doctorProfile.availability) || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Biography */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-xl border border-orange-200">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-orange-400 rounded-full">
                      <GraduationCap className="h-3.5 w-3.5 text-white" />
                    </div>
                    Professional Biography
                  </h3>
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-gray-700">
                      {doctorProfile.biography || "No biography provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DoctorProfileTab