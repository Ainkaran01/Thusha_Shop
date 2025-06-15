
import React from "react";
import { Button } from "@/components/ui/button";
import { List, Grid } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
            <DropdownMenuItem onClick={() => {
              toast({
                title: "Data Exported",
                description: "Dashboard data has been exported successfully.",
              });
            }}>
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("settings")}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              toast({
                title: "Reports Generated",
                description: "Monthly reports have been generated successfully.",
              });
            }}>
              Generate Reports
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
