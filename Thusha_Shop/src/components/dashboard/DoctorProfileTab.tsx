import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, GraduationCap } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Availability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface DoctorProfile {
  name: string;
  specialization: string;
  experience_years: number | string;
  qualifications: string;
  availability: Availability | string;
  biography: string;
}

interface DoctorProfileTabProps {
  doctorProfile: DoctorProfile;
  editingProfile: boolean;
  profileForm: DoctorProfile;
  onEditProfile: () => void;
  onSaveProfile: () => void;
  onProfileChange: (field: string, value: string | number | boolean | object) => void;
  onCancelEdit: () => void;
}

const DoctorProfileTab = ({
  doctorProfile,
  editingProfile,
  profileForm,
  onEditProfile,
  onSaveProfile,
  onProfileChange,
  onCancelEdit
}: DoctorProfileTabProps) => {
  // Parse availability from string if needed
  const getAvailabilityObject = (): Availability => {
    if (typeof profileForm.availability === 'string') {
      try {
        return JSON.parse(profileForm.availability) as Availability;
      } catch {
        return {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        };
      }
    }
    return profileForm.availability;
  };

  const currentAvailability = getAvailabilityObject();

  // Helper function to format availability for display
  const formatAvailability = (availability: Availability | string): string => {
    if (typeof availability === 'string') {
      try {
        const parsed = JSON.parse(availability) as Availability;
        return Object.entries(parsed)
          .filter(([_, isAvailable]) => isAvailable)
          .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
          .join(', ');
      } catch {
        return availability;
      }
    }

    return Object.entries(availability)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(', ');
  };

  // Handle checkbox changes for availability
  const handleAvailabilityChange = (day: keyof Availability, checked: boolean) => {
    const newAvailability = {
      ...currentAvailability,
      [day]: checked
    };
   onProfileChange('availability', newAvailability);

  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Professional Profile
        </CardTitle>
        {!editingProfile && (
          <Button onClick={onEditProfile}>Edit Profile</Button>
        )}
      </CardHeader>
      <CardContent>
        {editingProfile ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => onProfileChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={profileForm.specialization}
                  onChange={(e) => onProfileChange('specialization', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={profileForm.experience_years}
                  onChange={(e) => onProfileChange('experience_years', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  value={profileForm.qualifications}
                  onChange={(e) => onProfileChange('qualifications', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Available Days</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {Object.entries(currentAvailability).map(([day, isAvailable]) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={isAvailable}
                        onCheckedChange={(checked) => 
                          handleAvailabilityChange(day as keyof Availability, Boolean(checked))
                        }
                      />
                      <Label htmlFor={day} className="capitalize">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="biography">Professional Biography</Label>
              <Textarea
                id="biography"
                value={profileForm.biography}
                onChange={(e) => onProfileChange('biography', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={onSaveProfile}>Save Changes</Button>
              <Button variant="outline" onClick={onCancelEdit}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {doctorProfile.name || 'Not specified'}</p>
                  <p><strong>Specialization:</strong> {doctorProfile.specialization || 'Not specified'}</p>
                  <p><strong>Experience:</strong> {doctorProfile.experience_years || '0'} years</p>
                  <p><strong>Qualifications:</strong> {doctorProfile.qualifications || 'Not specified'}</p>
                  <p><strong>Availability:</strong> {formatAvailability(doctorProfile.availability) || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Professional Biography
              </h3>
              <p className="text-muted-foreground">
                {doctorProfile.biography || 'No biography provided'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorProfileTab;