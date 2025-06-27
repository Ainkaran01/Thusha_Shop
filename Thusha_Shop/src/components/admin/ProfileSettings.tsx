import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { Switch } from "@/components/ui/switch";

const ProfileSettings: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { adminProfile, fetchAdminProfile, updateAdminProfile } = useAdminDashboard();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    customer_support_phone: "",
    shop_status: "open",
    address: "",
  });

  const [errors, setErrors] = useState({
    phone_number: "",
    customer_support_phone: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  useEffect(() => {
    if (adminProfile && user && !initialized) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone_number: adminProfile.phone_number || "",
        customer_support_phone: adminProfile.customer_support_phone || "",
        shop_status: adminProfile.shop_status || "open",
        address: adminProfile.address || "",
      });

      if (adminProfile.image) {
        const url = adminProfile.image.startsWith("http")
          ? adminProfile.image
          : `http://localhost:8000/media/${adminProfile.image}`;
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      setInitialized(true);
    }
  }, [adminProfile, user, initialized]);

  const validatePhoneNumber = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone_number" || name === "customer_support_phone") {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Limit to 10 digits
      const limitedValue = digitsOnly.slice(0, 10);
      
      setFormData(prev => ({ ...prev, [name]: limitedValue }));
      
      // Validate on change
      if (limitedValue.length > 0 && !validatePhoneNumber(limitedValue)) {
        setErrors(prev => ({ ...prev, [name]: "Phone number must be 10 digits" }));
      } else {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.phone_number && !validatePhoneNumber(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
      isValid = false;
    }

    if (formData.customer_support_phone && !validatePhoneNumber(formData.customer_support_phone)) {
      newErrors.customer_support_phone = "Phone number must be 10 digits";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("customer_support_phone", formData.customer_support_phone);
      formDataToSend.append("shop_status", formData.shop_status);
      formDataToSend.append("address", formData.address);

      if (profileImage) {
        formDataToSend.append("image", profileImage);
      }

      await updateAdminProfile(formDataToSend);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage your account information and shop settings
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-8">
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="Profile" className="object-cover" />
                  ) : (
                    <AvatarFallback className="text-2xl bg-gray-100 dark:bg-gray-800">
                      {formData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="profile-image" className="text-sm font-medium">
                    Upload a new photo
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="profile-image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full max-w-xs"
                    />
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setPreviewUrl(null)}
                      disabled={!previewUrl}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, GIF or PNG. Max size of 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number (Main Office)</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    maxLength={10}
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-destructive">{errors.phone_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_support_phone">Customer Support Phone</Label>
                  <Input
                    id="customer_support_phone"
                    name="customer_support_phone"
                    value={formData.customer_support_phone}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    maxLength={10}
                  />
                  {errors.customer_support_phone && (
                    <p className="text-sm text-destructive">{errors.customer_support_phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shop Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shop Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin"}
                    readOnly
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="block">Shop Status</Label>
                  <div className="flex items-center gap-3 p-3 rounded-md border bg-white dark:bg-gray-900">
                    <Switch
                      checked={formData.shop_status === "open"}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          shop_status: checked ? "open" : "closed"
                        }))
                      }
                    />
                    <span className="text-sm font-medium">
                      {formData.shop_status === "open" ? "Open for business" : "Currently closed"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Shop Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t p-6 flex justify-end gap-2">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSettings;