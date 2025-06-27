import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Shield, Lock, KeyRound } from "lucide-react";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import { Separator } from "@/components/ui/separator";

const SecuritySettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl font-semibold">Security Center</CardTitle>
              <CardDescription className="text-sm">
                Manage your account security and authentication settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <Separator className="mb-6" />
        
        <CardContent className="space-y-8">
          {/* Password Change Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Password Management</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Change your account password. Make sure it's strong and unique to protect your account.
            </p>
            <div className="pt-2">
              <PasswordChangeForm />
            </div>
          </div>

          {/* Two-Factor Authentication Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <div className="pt-2">
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">2FA Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Currently disabled
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Sessions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
              <h3 className="text-lg font-medium">Active Sessions</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-3xl">
              View and manage devices that are currently logged in to your account.
            </p>
            <div className="pt-2">
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Current Session</h4>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • {new Date().toLocaleString()}
                      </p>
                    </div>
                    <button className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
                      Sign out
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;