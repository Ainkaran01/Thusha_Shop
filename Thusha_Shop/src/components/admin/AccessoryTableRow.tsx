import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash } from "lucide-react";
import EditAccessoryForm from "./EditAccessoryForm";
import { Accessory } from "@/types/accessory";

// Adjusted type to fix category error

interface AccessoryTableRowProps {
  accessory: Accessory;
  index: number;
  onUpdateStock: (
    accessoryId: number,
    newStock: number
  ) => Promise<void> | void;
  onDeleteAccessory: (accessoryId: number) => Promise<void> | void;
  onUpdateAccessory: (
    id: number,
    accessoryData: FormData
  ) => Promise<Accessory>;
}

const AccessoryTableRow: React.FC<AccessoryTableRowProps> = ({
  accessory,
  index,
  onUpdateStock,
  onDeleteAccessory,
  onUpdateAccessory,
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this accessory?",
      variant: "destructive",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            onDeleteAccessory(accessory.id);
            toast({
              title: "Accessory Deleted",
              description: "The accessory has been removed.",
            });
          }}
        >
          Confirm
        </Button>
      ),
    });
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    toast({
      title: "Success",
      description: "accessory updated successfully",
    });
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={9}>
          <EditAccessoryForm
            accessory={accessory}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        </TableCell>
      </TableRow>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <TableRow key={accessory.id}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell className="whitespace-nowrap">{accessory.name}</TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <img
            src={accessory.image}
            alt={accessory.name}
            className="w-10 h-10 object-cover rounded"
          />
        </div>
      </TableCell>
      <TableCell>{accessory.category?.name}</TableCell>
      <TableCell>{formatPrice(accessory.price)}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <span
            className={
              accessory.stock < 10 ? "text-destructive font-medium" : ""
            }
          >
            {accessory.stock}
          </span>
          {accessory.stock < 10 && (
            <AlertTriangle className="h-4 w-4 text-destructive ml-2" />
          )}
        </div>
      </TableCell>
      <TableCell>0{accessory.sold}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStock(accessory.id, accessory.stock + 10)}
            disabled={accessory.stock >= 1000}
          >
            Add Stock
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <div className="flex justify-end space-x-2 ">
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              <Pencil className="w-3 h-4" />
              Edit
            </Button>

            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash className="w-2 h-4 " />
              Delete
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AccessoryTableRow;
