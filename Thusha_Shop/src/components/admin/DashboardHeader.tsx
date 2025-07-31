
import React from "react";
import { Button } from "@/components/ui/button";
import { List, Grid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-clients";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DashboardHeaderProps {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  setActiveTab: (tab: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  viewMode, 
  setViewMode,
  setActiveTab
}) => {

  const { toast } = useToast();
  const { orders } = useAdminDashboard();

  const handleExportPOSData = async () => {
    try {
      const month = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const response = await apiClient.get(
      `/api/pointofsales/pos/?month=${month}`,
      { responseType: "blob" } 
    );
     const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pos_orders_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

      toast({
        title: "Data Exported",
        description: "Point of Sales data has been exported successfully.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Could not export POS data.",
      });
    }
  };

  const month = new Date().toISOString().slice(0, 7); 
  const filteredOrders = orders.filter((order) => {
  const orderMonth = order.created_at.slice(0, 7); 
  return orderMonth === month;
  })

  const getGroupedMonths = () => {
    const grouped: { [year: number]: number[] } = {};
    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      if (!grouped[year]) grouped[year] = [];
      if (!grouped[year].includes(month)) grouped[year].push(month);
    });
    for (const year in grouped) {
      grouped[year].sort((a, b) => b - a);
    }
    return Object.entries(grouped).sort((a, b) => Number(b[0]) - Number(a[0]));
  };

  const handleExportOrdersPDF = (month: string) => {
    const readableMonth = new Date(`${month}-01`).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const filtered = orders.filter((o) => o.created_at.startsWith(month));

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Online Orders Report - ${readableMonth}`, 14, 20);

    const tableData = filtered.map((order) => [
      order.order_number,
      order.billing?.name || "",
      order.items?.map((i) => `${i.product_name} x${i.quantity}`).join("; ") || "No items",
      `LKR ${order.total_price}`,
      order.status,
      order.assigned_delivery_person?.name || "Not Assigned",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Order #", "Customer", "Products", "Total", "Status", "Delivery Person"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    const total = filtered.reduce((acc, o) => acc + parseFloat(o.total_price), 0);
    doc.setFontSize(12);
    doc.text(`Total Sales for ${readableMonth}: LKR ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`online_orders_report_${month}.pdf`);
  };

  const groupedMonths = getGroupedMonths()

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
        >
          <List className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setViewMode("grid")}
          className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
        >
          <Grid className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPOSData}>
              Export POS Data
            </DropdownMenuItem>
            <DropdownMenuLabel>Export Orders by Month</DropdownMenuLabel>
            {groupedMonths.map(([year, months]) => (
              <DropdownMenuSub key={year}>
                <DropdownMenuSubTrigger>{year}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {months.map((month) => (
                    <DropdownMenuItem
                      key={`${year}-${month}`}
                      onClick={() => handleExportOrdersPDF(`${year}-${String(month).padStart(2, "0")}`)}
                    >
                      {new Date(`${year}-${month}-01`).toLocaleString("default", { month: "long" })}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
            <DropdownMenuItem onClick={() => setActiveTab("settings")}>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
