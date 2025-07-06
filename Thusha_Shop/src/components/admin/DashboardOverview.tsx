
import React from "react";
import StatCard from "./StatCard";
import DashboardCharts from "./DashboardCharts";
import RecentOrders from "./RecentOrders";
import ProductInventory from "./ProductInventory";
import UpcomingAppointments from "./UpcomingAppointments";
import { DollarSign, BarChart, Users, Package } from "lucide-react";
import { Product } from "@/types/product";
import { Order } from "@/api/orders";

interface DashboardStats {
  totalSales: number;
  monthlyRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  totalOrders: number;
  conversion: number;
}

interface Appointment {
  id: number;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  doctor_name: string;
}

interface SalesDataPoint {
  month: string;
  revenue: number;
}

interface CategoryDataPoint {
  id: string;
  value: number;
}

interface DashboardOverviewProps {
  viewMode: "list" | "grid";
  stats: DashboardStats;
  orders: Order[];
  products: Product[];
  appointments: Appointment[];
  salesData: SalesDataPoint[];
  categoryData: CategoryDataPoint[];
  setActiveTab: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  viewMode,
  stats,
  orders,
  products,
  appointments,
  salesData,
  categoryData,
  setActiveTab
}) => {
  return (
    <div className="space-y-6">
      <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"} gap-6`}>
      <StatCard 
        title="Total Sales" 
        value={`LKR ${stats.totalSales.toLocaleString()}`} 
        description="+12% from last month" 
        icon={<DollarSign className="h-4 w-4" />} 
        variant="green"
      />
      <StatCard 
        title="Monthly Revenue" 
        value={`LKR ${stats.monthlyRevenue.toLocaleString()}`} 
        description="+5.2% from last month" 
        icon={<BarChart className="h-4 w-4" />} 
        variant="blue"
      />
      <StatCard 
        title="Total Customers" 
        value={stats.totalCustomers} 
        description="+18 new customers" 
        icon={<Users className="h-4 w-4" />} 
        variant="yellow"
      />
      <StatCard 
        title="Pending Orders" 
        value={stats.pendingOrders} 
        description="Need processing" 
        icon={<Package className="h-4 w-4" />} 
        variant="red"
      />
      </div>

      <DashboardCharts salesData={salesData} categoryData={categoryData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentOrders 
          orders={orders} 
          onViewAllOrders={() => setActiveTab("orders")} 
        />
        
        <ProductInventory 
          products={products} 
          onManageInventory={() => setActiveTab("products")} 
        />
      </div>
      
      <UpcomingAppointments 
        appointments={appointments} 
        onViewAllAppointments={() => setActiveTab("appointments")} 
      />
    </div>
  );
};

export default DashboardOverview;
