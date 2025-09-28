import type React from "react";
import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusIcon,
  BanIcon,
  CheckCircleIcon,
  SearchIcon,
  UsersIcon,
  UserCheckIcon,
  UserCogIcon,
  StethoscopeIcon,
  TruckIcon,
  FactoryIcon,
  UserIcon,
  ShieldCheckIcon,
  CrownIcon,
} from "lucide-react";
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

const getRoleIcon = (role: string) => {
  const iconProps = { className: "h-4 w-4" };
  switch (role.toLowerCase()) {
    case "doctor":
      return <StethoscopeIcon {...iconProps} />;
    case "delivery":
      return <TruckIcon {...iconProps} />;
    case "manufacturer":
      return <FactoryIcon {...iconProps} />;
    case "customer":
      return <UserIcon {...iconProps} />;
    default:
      return <UserCogIcon {...iconProps} />;
  }
};

const getRandomAvatarColor = (str: string) => {
  const colors = [
    "bg-yellow-100 text-yellow-800",
    "bg-amber-100 text-amber-800",
    "bg-orange-100 text-orange-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
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
    doctor: "bg-blue-50 text-blue-700 border-blue-200",
    delivery: "bg-orange-50 text-orange-700 border-orange-200",
    manufacturer: "bg-purple-50 text-purple-700 border-purple-200",
    customer: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  // Calculate user statistics
  const userStats = useMemo(() => {
    const allCustomers = customers.filter(
      (u) => u.role.toLowerCase() === "customer"
    );
    const staff = customers.filter((u) => u.role.toLowerCase() !== "customer");

    return {
      totalCustomers: allCustomers.length,
      activeCustomers: allCustomers.filter((u) => u.is_active).length,
      inactiveCustomers: allCustomers.filter((u) => !u.is_active).length,
      totalStaff: staff.length,
      activeStaff: staff.filter((u) => u.is_active).length,
      inactiveStaff: staff.filter((u) => !u.is_active).length,
      doctors: staff.filter((u) => u.role.toLowerCase() === "doctor").length,
      manufacturers: staff.filter(
        (u) => u.role.toLowerCase() === "manufacturer"
      ).length,
      delivery: staff.filter((u) => u.role.toLowerCase() === "delivery").length,
    };
  }, [customers]);

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
      <CardHeader className="flex flex-col gap-6 px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
              <UsersIcon className="h-7 w-7 text-yellow-600" />
              User Management
            </CardTitle>

            <CardDescription className="text-gray-600 mt-1">
              Manage all system users and their access permissions
            </CardDescription>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <PlusIcon className="h-4 w-4" />
                Add Staff Member
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">
                  Create Staff Account
                </SheetTitle>
                <SheetDescription className="text-gray-600">
                  Create a new staff account with specific role permissions.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter secure password"
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Role & Permissions
                  </Label>
                  <Select
                    value={newStaffRole}
                    onValueChange={(
                      value: "doctor" | "delivery" | "manufacturer"
                    ) => setNewStaffRole(value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">
                        <div className="flex items-center gap-2">
                          <StethoscopeIcon className="h-4 w-4" />
                          Doctor
                        </div>
                      </SelectItem>
                      <SelectItem value="manufacturer">
                        <div className="flex items-center gap-2">
                          <FactoryIcon className="h-4 w-4" />
                          Manufacturer
                        </div>
                      </SelectItem>
                      <SelectItem value="delivery">
                        <div className="flex items-center gap-2">
                          <TruckIcon className="h-4 w-4" />
                          Delivery Personnel
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <Button
                  onClick={handleCreateStaff}
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Staff Account"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Customers Card */}
          <Card className="h-36 hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Customers
              </CardTitle>
              <div className=" bg-yellow-100 rounded-lg">
                <UsersIcon className="h-4 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {userStats.totalCustomers}
              </div>
              <p className="text-sm text-gray-600 mt-1">Registered customers</p>
            </CardContent>
          </Card>

          {/* Active Customers Card */}
          <Card className="h-36 hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Active Customers
              </CardTitle>
              <div className="bg-green-100 rounded-lg">
                <UserCheckIcon className="h-4 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {userStats.activeCustomers}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {userStats.totalCustomers > 0
                  ? `${Math.round(
                      (userStats.activeCustomers / userStats.totalCustomers) *
                        100
                    )}% active rate`
                  : "No customers yet"}
              </p>
            </CardContent>
          </Card>

          {/* Staff Summary Card */}
          <Card className="h-36 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Staff Members
              </CardTitle>
              <div className="bg-blue-100 rounded-lg">
                <UserCogIcon className="h-4 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {userStats.totalStaff}
              </div>
              <div className="flex flex-wrap gap-1 text-sm text-gray-600 mt-1">
                <span>{userStats.doctors} doctors</span>
                <span>•</span>
                <span>{userStats.manufacturers} manufacturers</span>
                <span>•</span>
                <span>{userStats.delivery} delivery</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Staff Card */}
          <Card className="h-36 hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-400 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Active Staff
              </CardTitle>
              <div className="bg-purple-100 rounded-lg">
                <ShieldCheckIcon className="h-4 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {userStats.activeStaff}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {userStats.totalStaff > 0
                  ? `${Math.round(
                      (userStats.activeStaff / userStats.totalStaff) * 100
                    )}% active rate`
                  : "No staff yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls - keeping search box unchanged as requested */}
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
              <SelectTrigger className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="doctor">
                  <div className="flex items-center gap-2">
                    <StethoscopeIcon className="h-4 w-4" />
                    Doctors
                  </div>
                </SelectItem>
                <SelectItem value="manufacturer">
                  <div className="flex items-center gap-2">
                    <FactoryIcon className="h-4 w-4" />
                    Manufacturers
                  </div>
                </SelectItem>
                <SelectItem value="delivery">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-4 w-4" />
                    Delivery Personnel
                  </div>
                </SelectItem>
                <SelectItem value="customer">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Customers
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-8">
        {visibleRoles.length > 0 ? (
          visibleRoles.map((role) => (
            <div
              key={role}
              className="rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getRoleIcon(role)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {roleDisplayNames[role] || `${role}s`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {customersByRole[role]?.length || 0}{" "}
                      {customersByRole[role]?.length === 1 ? "user" : "users"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${roleBadgeColors[role]} font-medium px-3 py-1`}
                  >
                    {customersByRole[role]?.length || 0}
                  </Badge>
                  {role !== "customer" && (
                    <Badge
                      variant="outline"
                      className="border-yellow-300 text-yellow-700 bg-yellow-50 font-medium"
                    >
                      <CrownIcon className="h-3 w-3 mr-1" />
                      Staff
                    </Badge>
                  )}
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-200 text-white">
                    <TableHead className="w-[300px] font-semibold">
                      User Information
                    </TableHead>
                    <TableHead className="font-semibold">
                      Email Address
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold">
                      User ID
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold">
                      Status
                    </TableHead>
                    {role !== "customer" && (
                      <TableHead className="w-[150px] text-right font-semibold">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersByRole[role]?.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-gray-100/100 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                            <AvatarFallback
                              className={`font-semibold ${getRandomAvatarColor(
                                customer.name
                              )}`}
                            >
                              {customer.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {customer.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getRoleIcon(role)}
                              <p className="text-sm text-gray-600 capitalize">
                                {role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {customer.email}
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          UID-{customer.id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={customer.is_active ? "default" : "secondary"}
                          className={
                            customer.is_active
                              ? "bg-green-100 text-green-800 border-green-200 font-medium"
                              : "bg-gray-100 text-gray-800 border-gray-200 font-medium"
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
                            className={`h-9 font-medium transition-all duration-200 ${
                              customer.is_active
                                ? "hover:shadow-md"
                                : "bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-md"
                            }`}
                          >
                            {customer.is_active ? (
                              <>
                                <BanIcon className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
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
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <SearchIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-xl font-medium text-gray-700">
                No users found
              </p>
              <p className="text-gray-500 mt-1">
                Try adjusting your search criteria
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedRole("all");
              }}
              className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {customerToUpdate?.is_active
                ? "Deactivate User Account?"
                : "Activate User Account?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {customerToUpdate?.is_active
                ? `Are you sure you want to deactivate ${customerToUpdate.name}? They will lose access to the system immediately.`
                : `Are you sure you want to activate ${customerToUpdate?.name}? They will regain full access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CustomersTable;
