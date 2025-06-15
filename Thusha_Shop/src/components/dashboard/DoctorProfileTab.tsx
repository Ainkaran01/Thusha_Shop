import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, GraduationCap } from 'lucide-react';

interface DoctorProfileTabProps {
  doctorProfile: any;
  editingProfile: boolean;
  profileForm: any;
  onEditProfile: () => void;
  onSaveProfile: () => void;
  onProfileChange: (field: string, value: string) => void;
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
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={profileForm.availability}
                  onChange={(e) => onProfileChange('availability', e.target.value)}
                  placeholder="e.g. Mon-Fri"
                />
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
                  <p><strong>Name:</strong> {doctorProfile.name}</p>
                  <p><strong>Specialization:</strong> {doctorProfile.specialization}</p>
                  <p><strong>Experience:</strong> {doctorProfile.experience_years}</p>
                  <p><strong>Qualifications:</strong> {doctorProfile.qualifications}</p>
                  <p><strong>Availability:</strong> {doctorProfile.availability}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Professional Biography
              </h3>
              <p className="text-muted-foreground">{doctorProfile.biography}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorProfileTab;
