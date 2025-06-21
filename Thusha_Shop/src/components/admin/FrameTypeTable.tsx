import React, { useState } from "react";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const FrameTypesTable: React.FC = () => {
  const {
    frameTypes,
    addFrameType,
    updateFrameType,
    deleteFrameType,
  } = useAdminDashboard();

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await addFrameType(newName.trim(), newDescription.trim());
      setNewName("");
      setNewDescription("");
    } catch (error) {
      console.error("Add frame type failed:", error);
    }
  };

  const handleUpdate = async () => {
    if (editingId && editName.trim()) {
      try {
        await updateFrameType(editingId, editName.trim(), editDescription.trim());
        setEditingId(null);
        setEditName("");
        setEditDescription("");
      } catch (error) {
        console.error("Update frame type failed:", error);
      }
    }
  };

  
  const { toast } = useToast();

  const handleDelete = (id: number) => {
  toast({
    title: "Confirm Deletion",
    description: "Are you sure you want to delete this frame type?",
    variant: "destructive",
    action: (
      <Button
        variant="destructive"
        size="sm"
        onClick={async () => {
          try {
            await deleteFrameType(id);
            toast({
              title: "Deleted",
              description: "Frame type has been removed.",
            });
          } catch (error) {
            console.error("Failed to delete:", error);
            toast({
              title: "Error",
              description: "Failed to delete frame type.",
              variant: "destructive",
            });
          }
        }}
      >
        Confirm
      </Button>
    ),
  });
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frame Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New Frame Type"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {frameTypes.length > 0 ? (
              frameTypes.map((f, index) => (
                <TableRow key={f.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {editingId === f.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      f.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === f.id ? (
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    ) : (
                      f.description || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === f.id ? (
                      <Button onClick={handleUpdate}>Save</Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setEditingId(f.id);
                          setEditName(f.name);
                          setEditDescription(f.description || "");
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(f.id)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No frame types available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FrameTypesTable;
