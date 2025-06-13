
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

const SettingsPanel: React.FC = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useUser();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>(user?.profilePhoto || "");
  const [name, setName] = useState<string>(user?.name || "");

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to a server and get a URL back
      // For now, we'll use a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (user) {
      updateProfile({
        ...user,
        name: name,
        profilePhoto: profilePhotoUrl || undefined
      }).then(() => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePhotoUrl} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2">
              <label htmlFor="profilePhotoUpload" className="cursor-pointer">
                <div className="bg-primary text-white px-3 py-1.5 rounded-md text-sm">
                  Change Photo
                </div>
                <input 
                  type="file" 
                  id="profilePhotoUpload"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
              </label>
              
              {profilePhotoUrl && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setProfilePhotoUrl("")}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                value={user?.email || ''}
                className="w-full" 
                disabled
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} className="ml-auto">Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsPanel;
