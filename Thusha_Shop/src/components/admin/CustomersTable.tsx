import React, { useState, useMemo } from "react";
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
import { PlusIcon, BanIcon, CheckCircleIcon, SearchIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
  const colors = [
    "bg-pink-100 text-pink-800",
    "bg-purple-100 text-purple-800",
    "bg-yellow-100 text-yellow-800",
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Define role order and display names
  const roleOrder = ["doctor", "manufacturer", "delivery", "customer"];
  const roleDisplayNames: Record<string, string> = {
    doctor: "Doctors",
    delivery: "Delivery Personnel",
    manufacturer: "Manufacturers",
    customer: "Customers",
    all: "All Roles",
  };

  const roleBadgeColors: Record<string, string> = {
    doctor: "bg-blue-100 text-blue-800",
    delivery: "bg-orange-100 text-orange-800",
    manufacturer: "bg-purple-100 text-purple-800",
    customer: "bg-gray-100 text-gray-800",
  };

  // Filter and sort customers based on search and role selection
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Filter by search term (name or email)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term)
      );
    }

    // Filter by selected role
    if (selectedRole !== "all") {
      result = result.filter(
        (customer) => customer.role.toLowerCase() === selectedRole.toLowerCase()
      );
    }

    // Sort by active status (active first) then by ID
    return result.sort((a, b) => {
      if (a.is_active === b.is_active) {
        return a.id - b.id;
      }
      return a.is_active ? -1 : 1;
    });
  }, [customers, searchTerm, selectedRole]);

  // Group filtered customers by role
  const customersByRole = useMemo(() => {
    return filteredCustomers.reduce((acc, customer) => {
      const role = customer.role.toLowerCase();
      if (!acc[role]) acc[role] = [];
      acc[role].push(customer);
      return acc;
    }, {} as Record<string, Customer[]>);
  }, [filteredCustomers]);

  // Get roles present in filtered results
  const visibleRoles = useMemo(() => {
    const roles = new Set<string>();
    filteredCustomers.forEach((customer) =>
      roles.add(customer.role.toLowerCase())
    );
    return roleOrder.filter((role) => roles.has(role));
  }, [filteredCustomers]);

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
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-col gap-4 px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">User Management</CardTitle>
            <CardDescription>
              Manage all system users and their access
            </CardDescription>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Staff
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create Staff Account</SheetTitle>
                <SheetDescription>
                  Create a new staff account with specific permissions.
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
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="manufacturer">Manufacturer</SelectItem>
                      <SelectItem value="delivery">
                        Delivery Personnel
                      </SelectItem>
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
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="manufacturer">Manufacturers</SelectItem>
                <SelectItem value="delivery">Delivery Personnel</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-8">
        {visibleRoles.length > 0 ? (
          visibleRoles.map((role) => (
            <div key={role} className="rounded-lg border overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-lg">
                    {roleDisplayNames[role] || `${role}s`}
                  </h3>
                  <Badge className={roleBadgeColors[role]}>
                    {customersByRole[role]?.length || 0}{" "}
                    {customersByRole[role]?.length === 1 ? "user" : "users"}
                  </Badge>
                </div>
                {role !== "customer" && (
                  <Badge variant="outline" className="border-gray-300">
                    Staff
                  </Badge>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    {role !== "customer" && (
                      <TableHead className="w-[150px] text-right">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersByRole[role]?.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback
                              className={`text-white ${getRandomAvatarColor(
                                customer.name
                              )}`}
                            >
                              {customer.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-500">{role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>UID-{customer.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant={customer.is_active ? "default" : "secondary"}
                          className={
                            customer.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {customer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      {role !== "customer" && (
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={
                              customer.is_active ? "destructive" : "default"
                            }
                            onClick={() => {
                              setCustomerToUpdate(customer);
                              setIsConfirmOpen(true);
                            }}
                            className="h-8"
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
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-500">
            <SearchIcon className="h-8 w-8" />
            <p className="text-lg">No users found matching your criteria</p>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setSelectedRole("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
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
