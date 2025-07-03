import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

export const useOrderHistory = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-tracking?orderId=${orderId}`);
    toast({
      title: "Redirecting to Order Details",
      description: `Viewing details for order ${orderId}`,
    });
  };

  const handleDownloadInvoice = (order: any) => {
  const invoiceLines = [
    `📦 Invoice for Order #${order.order_number || order.id}`,
    `📅 Date: ${new Date(order.created_at).toLocaleDateString()}`,
    `💳 Payment Method: ${order.payment_method}`,
    `🚚 Delivery Option: ${order.deliveryOption || order.delivery_option}`,
    '',
    `--- 🛒 Items ---`,
    ...order.items.map((item: any, i: number) =>
      `${i + 1}. ${item.product_name} - Qty: ${item.quantity} - Price: LKR ${item.price}`
    ),
    '',
    `💰 Total: LKR ${order.total_price}`,
    '',
    `👤 Billing Info:`,
    `Name: ${order.billing?.name}`,
    `Email: ${order.billing?.email}`,
    `Phone: ${order.billing?.phone}`,
    `Address: ${order.billing?.address1}, ${order.billing?.address2 || ''}, ${order.billing?.city}, ${order.billing?.state} - ${order.billing?.zipCode}, ${order.billing?.country}`,
    '',
    '🎉 Thank you for shopping with us!',
  ];

  const invoiceData = invoiceLines.join('\n');

  const blob = new Blob([invoiceData], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${order.order_number || order.id}.txt`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  toast({
    title: "Invoice Downloaded",
    description: `Detailed invoice for order ${order.order_number || order.id} has been downloaded.`,
  });
};


  const handleReorder = async (order: any) => {
    let itemsAdded = 0;

    for (const item of order.items) {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${item.product_id}`);
        if (!response.ok) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        const product: Product = await response.json();

        // Add the product `item.quantity` times to cart
        for (let i = 0; i < item.quantity; i++) {
          addToCart(product);
          itemsAdded++;
        }
      } catch (error) {
        console.error(`Failed to reorder product ${item.product_id}:`, error);
        toast({
          title: "Reorder Error",
          description: `Could not add product ${item.product_id} to cart.`,
          variant: "destructive",
        });
      }
    }

    if (itemsAdded > 0) {
      toast({
        title: "Items Added to Cart",
        description: `${itemsAdded} items from order ${order.id} have been added to your cart`,
      });

      navigate('/cart');
    }
  };

  return {
    handleViewDetails,
    handleDownloadInvoice,
    handleReorder,
  };
};
