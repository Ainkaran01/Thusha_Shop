import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAdminDashboard } from "@/context/AdminDashboardContext";

const CategoryTable: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminDashboard();
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory.trim(), newDescription.trim());
      setNewCategory("");
      setNewDescription("");
      toast({ title: "Category added" });
    } catch (error) {
      toast({ title: "Add failed", variant: "destructive" });
    }
  };

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
            await deleteCategory(id);
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
  const handleEdit = (id: number, name: string, description: string) => {
    setEditId(id);
    setEditName(name);
    setEditDescription(description);
  };

  const handleUpdate = async () => {
    try {
      if (editId !== null && editName.trim()) {
        await updateCategory(editId, editName.trim(), editDescription.trim());
        setEditId(null);
        setEditName("");
        setEditDescription("");
        toast({ title: "Category updated" });
      }
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
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
              <TableHead>SL</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat, index) => (
              <TableRow key={cat.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {editId === cat.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    cat.name
                  )}
                </TableCell>
                <TableCell>
                  {editId === cat.id ? (
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    cat.description || "-"
                  )}
                </TableCell>
                <TableCell>
                  {editId === cat.id ? (
                    <Button onClick={handleUpdate}>Save</Button>
                  ) : (
                    <Button
                      onClick={() =>
                        handleEdit(cat.id, cat.name, cat.description || "")
                      }
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(cat.id)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoryTable;
