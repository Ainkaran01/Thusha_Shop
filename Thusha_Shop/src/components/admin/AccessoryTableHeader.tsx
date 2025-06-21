
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AccessoryTableHeaderProps {
  onAddAccessory: () => void;
}

const AccessoryTableHeader: React.FC<AccessoryTableHeaderProps> = ({ onAddAccessory }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Accessory List</CardTitle>
       
      </div>
      <Button 
        onClick={onAddAccessory}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" /> Add Accessory
      </Button>
    </CardHeader>
  );
};

export default AccessoryTableHeader;
