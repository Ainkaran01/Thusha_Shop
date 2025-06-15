import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

interface ProfileFormData {
  name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

const ProfileInformation = () => {
  const { user, updateProfile, fetchProfile } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "Sri Lanka",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone_number: user?.profile?.phone_number || "",
        address_line1: user?.profile?.address_line1 || "",
        address_line2: user?.profile?.address_line2 || "",
        city: user?.profile?.city || "",
        state: user?.profile?.state || "",
        zip_code: user?.profile?.zip_code || "",
        country: user?.profile?.country || "Sri Lanka",
      });
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name,
        profile: {
          phone_number: formData.phone_number,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
        }
      });
      
      // Refresh profile data after update
      await fetchProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={user?.email || ""} 
              disabled 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input 
            id="phone_number" 
            name="phone_number"
            placeholder="Add your phone number" 
            value={formData.phone_number} 
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">Street Address 1</Label>
            <Input 
              id="address_line1" 
              name="address_line1"
              placeholder="Add your street address" 
              value={formData.address_line1} 
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address_line2">Street Address 2 (Optional)</Label>
            <Input 
              id="address_line2" 
              name="address_line2"
              placeholder="Apartment, suite, etc." 
              value={formData.address_line2} 
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              name="city"
              placeholder="City" 
              value={formData.city} 
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input 
              id="state" 
              name="state"
              placeholder="State" 
              value={formData.state} 
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zip_code">ZIP Code</Label>
            <Input 
              id="zip_code" 
              name="zip_code"
              placeholder="ZIP Code" 
              value={formData.zip_code} 
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              name="country"
              value={formData.country} 
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </>
  );
};

export default ProfileInformation;