
import React from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface StaffAccountManagerProps {
  children: React.ReactNode;
}

// Define a type for components that can accept the onCreateStaffAccount prop
export interface StaffAccountReceiverProps {
  onCreateStaffAccount?: (name: string, email: string, password: string, role: "doctor" | "delivery" | "manufacturer") => Promise<void>;
}

const StaffAccountManager: React.FC<StaffAccountManagerProps> = ({ children }) => {
  const { register } = useUser();
  const { toast } = useToast();

  // Function to create a doctor or delivery staff account
  const handleCreateStaffAccount = async (name: string, email: string, password: string, role: "doctor" | "delivery" | "manufacturer") => {
    try {
      await register(name, email, password, role);
      toast({
        title: "Account Created",
        description: `New ${role} account for ${name} created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error Creating Account",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Clone children with the staff account creation function
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // Check if the component type is explicitly looking for onCreateStaffAccount in its props
          // This is a simplistic check, but it prevents adding the prop to elements that definitely don't need it
          // @ts-ignore - We're doing a runtime check that TypeScript can't verify statically
          if (child.type && child.type.propTypes && child.type.propTypes.onCreateStaffAccount) {
            // Use the correct type assertion to tell TypeScript this child can accept onCreateStaffAccount
            return React.cloneElement(child as React.ReactElement<StaffAccountReceiverProps>, {
              onCreateStaffAccount: handleCreateStaffAccount
            });
          }
          
          // Otherwise, just pass the child unchanged
          return child;
        }
        return child;
      })}
    </>
  );
};

export default StaffAccountManager;
