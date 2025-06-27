
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Package, Eye, Clock, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/types';

interface ManufacturerOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  frameDetails: {
    name: string;
    color: string;
    material: string;
    size?: string;
  };
  lensDetails: {
    type: 'standard' | 'prescription';
    option?: string;
    prescription?: {
      rightEye: { sphere: number; cylinder: number; axis: number };
      leftEye: { sphere: number; cylinder: number; axis: number };
    };
  };
  status: OrderStatus;
  totalAmount: number;
  manufacturerNotes?: string;
}

const ManufacturerDashboard = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<ManufacturerOrder[]>([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      orderDate: '2024-01-15',
      frameDetails: {
        name: 'Classic Aviator',
        color: 'Gold',
        material: 'Metal',
        size: '52-18-145'
      },
      lensDetails: {
        type: 'prescription',
        option: 'Premium Prescription',
        prescription: {
          rightEye: { sphere: -2.5, cylinder: -1.0, axis: 90 },
          leftEye: { sphere: -2.0, cylinder: -0.5, axis: 85 }
        }
      },
      status: 'processing',
      totalAmount: 299.99,
      manufacturerNotes: 'High-end frame with complex prescription'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      orderDate: '2024-01-14',
      frameDetails: {
        name: 'Modern Square',
        color: 'Black',
        material: 'Acetate',
        size: '54-16-140'
      },
      lensDetails: {
        type: 'standard',
        option: 'Anti-Blue Light'
      },
      status: 'processing',
      totalAmount: 199.99
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<ManufacturerOrder | null>(null);
  const [manufacturerNotes, setManufacturerNotes] = useState('');

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    // Manufacturers can only update to "ready_to_deliver"
    if (newStatus !== 'ready_to_deliver' && newStatus !== 'processing') {
      toast({
        title: "Action Not Allowed",
        description: "Manufacturers can only mark orders as Processing or Ready to Deliver",
        variant: "destructive"
      });
      return;
    }

    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, manufacturerNotes: notes || order.manufacturerNotes }
        : order
    ));

    toast({
      title: "Order Updated",
      description: `Order ${orderId} status updated to ${newStatus.replace('_', ' ')}`,
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'ready_to_deliver': return <Package className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'ready_to_deliver': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders that manufacturers should see (not delivered/cancelled)
  const activeOrders = orders.filter(order => 
    ['processing', 'ready_to_deliver', 'shipped'].includes(order.status)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manufacturer Dashboard</h1>
        <p className="text-muted-foreground">Manage eyeglass production and prepare orders for delivery</p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Production</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ready to Deliver</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'ready_to_deliver').length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Active Orders</p>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Frame Details</TableHead>
                <TableHead>Lens Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.frameDetails.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.frameDetails.color} {order.frameDetails.material}
                      </p>
                      {order.frameDetails.size && (
                        <p className="text-sm text-muted-foreground">Size: {order.frameDetails.size}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline">{order.lensDetails.type}</Badge>
                      {order.lensDetails.option && (
                        <p className="text-sm text-muted-foreground mt-1">{order.lensDetails.option}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status.replace('_', ' ')}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {order.status === 'processing' && (
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'ready_to_deliver')}
                        >
                          Mark Ready
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Manufacturing Details - {selectedOrder.id}</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                  <p><strong>Total:</strong> ${selectedOrder.totalAmount}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Production Status</h4>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">{selectedOrder.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Frame Specifications</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Model:</strong> {selectedOrder.frameDetails.name}</p>
                  <p><strong>Color:</strong> {selectedOrder.frameDetails.color}</p>
                  <p><strong>Material:</strong> {selectedOrder.frameDetails.material}</p>
                  {selectedOrder.frameDetails.size && (
                    <p><strong>Size:</strong> {selectedOrder.frameDetails.size}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Lens Specifications</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Type:</strong> {selectedOrder.lensDetails.type}</p>
                  {selectedOrder.lensDetails.option && (
                    <p><strong>Option:</strong> {selectedOrder.lensDetails.option}</p>
                  )}
                  {selectedOrder.lensDetails.prescription && (
                    <div className="mt-2">
                      <p><strong>Prescription Details:</strong></p>
                      <div className="ml-4 mt-1 space-y-1">
                        <p><strong>Right Eye:</strong> SPH {selectedOrder.lensDetails.prescription.rightEye.sphere}, CYL {selectedOrder.lensDetails.prescription.rightEye.cylinder}, AXIS {selectedOrder.lensDetails.prescription.rightEye.axis}</p>
                        <p><strong>Left Eye:</strong> SPH {selectedOrder.lensDetails.prescription.leftEye.sphere}, CYL {selectedOrder.lensDetails.prescription.leftEye.cylinder}, AXIS {selectedOrder.lensDetails.prescription.leftEye.axis}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Manufacturing Notes</h4>
                <Textarea
                  value={manufacturerNotes || selectedOrder.manufacturerNotes || ''}
                  onChange={(e) => setManufacturerNotes(e.target.value)}
                  placeholder="Add production notes, special instructions, or quality checks..."
                  rows={4}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, selectedOrder.status, manufacturerNotes);
                      setManufacturerNotes('');
                    }}
                    size="sm"
                  >
                    Save Notes
                  </Button>
                  {selectedOrder.status === 'processing' && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'ready_to_deliver', manufacturerNotes);
                        setManufacturerNotes('');
                        setSelectedOrder(null);
                      }}
                    >
                      Mark as Ready to Deliver
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManufacturerDashboard;
