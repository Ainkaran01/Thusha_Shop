import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/admin/ProfileSettings";
import SecuritySettings from "@/components/admin/SecuritySettings";
import { Card } from "@/components/ui/card";
import { Settings2, User, Shield } from "lucide-react";
import { Settings } from "lucide-react";

const AccountSettings: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
          <Settings className="h-7 w-7 text-yellow-600" />
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile information and security settings
        </p>
      </div>

      <Card className="overflow-hidden">
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b">
            <TabsList className="w-full md:w-auto rounded-none bg-transparent p-0 bg-gradient-to-r from-gray-50 to-gray-100">
              <TabsTrigger
                value="profile"
                className="relative px-6 py-3 rounded-none data-[state=active]:bg-yellow-600 data-[state=active]:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary opacity-0 data-[state=active]:opacity-100 transition-opacity" />
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="relative px-6 py-3 rounded-none data-[state=active]:bg-yellow-600 data-[state=active]:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary opacity-0 data-[state=active]:opacity-100 transition-opacity" />
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="profile" className="m-0">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <SecuritySettings />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AccountSettings;
