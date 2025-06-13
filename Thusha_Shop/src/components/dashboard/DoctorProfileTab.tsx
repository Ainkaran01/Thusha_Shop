
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Award, GraduationCap, Plus } from 'lucide-react';

interface DoctorProfileTabProps {
  doctorProfile: any;
  editingProfile: boolean;
  profileForm: any;
  onEditProfile: () => void;
  onSaveProfile: () => void;
  onProfileChange: (field: string, value: string | string[]) => void;
  onAddExpertise: () => void;
  onRemoveExpertise: (index: number) => void;
  onCancelEdit: () => void;
}

const DoctorProfileTab = ({
  doctorProfile,
  editingProfile,
  profileForm,
  onEditProfile,
  onSaveProfile,
  onProfileChange,
  onAddExpertise,
  onRemoveExpertise,
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
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={profileForm.experience}
                  onChange={(e) => onProfileChange('experience', e.target.value)}
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

            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Areas of Expertise</Label>
                <Button type="button" variant="outline" size="sm" onClick={onAddExpertise}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Expertise
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileForm.expertise.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => onRemoveExpertise(index)} className="ml-1 text-xs">×</button>
                  </Badge>
                ))}
              </div>
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
                  <p><strong>Experience:</strong> {doctorProfile.experience}</p>
                  <p><strong>Qualifications:</strong> {doctorProfile.qualifications}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctorProfile.expertise.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
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