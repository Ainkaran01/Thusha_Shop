import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, BanIcon, CheckCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface CustomersTableProps {
  customers: Customer[];
  onCreateStaffAccount: (
    name: string,
    email: string,
    password: string,
    role: "doctor" | "delivery" | "manufacturer"
  ) => Promise<void>;
  onDeactivateCustomer: (id: number) => Promise<void>;
  onActivateCustomer: (id: number) => Promise<void>;
}

const getRandomAvatarColor = (str: string) => {
  // Generate a consistent color based on the string
  const colors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-red-500",
    "bg-indigo-500",
  ];
  const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  onCreateStaffAccount,
  onDeactivateCustomer,
  onActivateCustomer,
}) => {
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<
    "doctor" | "delivery" | "manufacturer"
  >("doctor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerToUpdate, setCustomerToUpdate] = useState<Customer | null>(
    null
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

   // Group customers by role
  const customersByRole = customers.reduce((acc, customer) => {
    const role = customer.role.toLowerCase();
    if (!acc[role]) acc[role] = [];
    acc[role].push(customer);
    return acc;
  }, {} as Record<string, Customer[]>);

  // Define role display names
  const roleDisplayNames: Record<string, string> = {
    doctor: "Doctors",
    delivery: "Delivery Personnel",
    manufacturer: "Manufacturers",
    customer: "Customers"
  };


  const handleCreateStaff = async () => {
    if (!newStaffName || !newStaffEmail || !newStaffPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateStaffAccount(
        newStaffName,
        newStaffEmail,
        newStaffPassword,
        newStaffRole
      );
      setIsSheetOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Staff account created successfully.",
      });
    } catch (error) {
      console.error("Error creating staff account:", error);
      toast({
        title: "Error",
        description: "Failed to create staff account.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!customerToUpdate) return;

    try {
      if (customerToUpdate.is_active) {
        await onDeactivateCustomer(customerToUpdate.id);
        toast({
          title: "Success",
          description: "User deactivated successfully.",
        });
      } else {
        await onActivateCustomer(customerToUpdate.id);
        toast({
          title: "Success",
          description: "User activated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    } finally {
      setIsConfirmOpen(false);
      setCustomerToUpdate(null);
    }
  };

  const resetForm = () => {
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPassword("");
    setNewStaffRole("doctor");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>User Database</CardTitle>
          <CardDescription>View user details</CardDescription>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>Add Staff Account</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create Staff Account</SheetTitle>
              <SheetDescription>
                Create a new doctor or delivery personnel account.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={newStaffPassword}
                  onChange={(e) => setNewStaffPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newStaffRole}
                  onValueChange={(
                    value: "doctor" | "delivery" | "manufacturer"
                  ) => setNewStaffRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="delivery">Delivery Personnel</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter>
              <Button onClick={handleCreateStaff} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardHeader>
  <CardContent className="space-y-6">
        {Object.entries(customersByRole).map(([role, roleCustomers]) => (
          <div key={role} className="rounded-md border overflow-hidden">
            <div className="bg-gray-100 px-6 py-3 border-b">
              <h3 className="font-medium text-lg">
                {roleDisplayNames[role] || `${role}s`}
                <span className="text-sm text-gray-500 ml-2">
                  ({roleCustomers.length})
                </span>
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                   <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className={`h-8 w-8 mr-2 ${getRandomAvatarColor(customer.name)}`}>
                          <AvatarFallback className="text-white">
                            {customer.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>Uid-{customer.id}</TableCell>
                    <TableCell className={customer.is_active ? "text-green-600" : "text-red-600"}>
                      {customer.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCustomerToUpdate(customer);
                          setIsConfirmOpen(true);
                        }}
                        className={customer.is_active 
                          ? "bg-red-100 text-red-600 hover:bg-red-200" 
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                        }
                      >
                        {customer.is_active ? (
                          <>
                            <BanIcon className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {customerToUpdate?.is_active
                ? "Deactivate User?"
                : "Activate User?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {customerToUpdate?.is_active
                ? `Are you sure you want to deactivate ${customerToUpdate.name}? They will no longer have access to the system.`
                : `Are you sure you want to activate ${customerToUpdate?.name}? They will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CustomersTable;
