import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AddAccessoriesForm from "./AddAccessoriesForm";
import AccessoryTableHeader from "./AccessoryTableHeader";
import AccessoryTableRow from "./AccessoryTableRow";
import { Accessory } from "@/types/accessory";
import Accessories from "@/pages/Accessories";

interface AccessoryTableProps {
  accessories?: Accessory[];
  onUpdateStock: (accessoryId: number, newStock: number) => void;
  onDeleteAccessory: (accessoryId: number) => void;
  onAddAccessory: (accessoryData: FormData) => Promise<Accessory>;
  onUpdateAccessory: (
    id: number,
    accessoryData: FormData

  ) => Promise<Accessory>;
}


const AccessoryTable: React.FC<AccessoryTableProps> = ({
  accessories = [],
  onUpdateStock,
  onDeleteAccessory,
  onAddAccessory,
  onUpdateAccessory,
}) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

 
  return (
    <Card>
      <Tabs defaultValue="accessories" className="w-full">
        <TabsContent value="accessories">
          {showAddForm ? (
            <AddAccessoriesForm onCancel={() => setShowAddForm(false)} />
          ) : (
            <>
              <AccessoryTableHeader
                onAddAccessory={() => setShowAddForm(true)}
              />
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Accessory</th>
                          <th className="px-4 py-2 text-left">Image</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Stock</th>
                          <th className="px-4 py-2 text-left">Sold</th>
                          <th className="px-4 py-2 text-left"></th>
                          <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessories.map((accessory, index) => (
                          <AccessoryTableRow
                            key={accessory.id}
                            accessory={accessory}
                            index={index}
                            onUpdateStock={onUpdateStock}
                            onDeleteAccessory={onDeleteAccessory}
                            onUpdateAccessory={onUpdateAccessory}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AccessoryTable;
