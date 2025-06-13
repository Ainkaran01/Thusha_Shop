
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

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

  const handleDownloadInvoice = (orderId: string) => {
    const invoiceData = `Invoice for Order ${orderId}\nDate: ${new Date().toLocaleDateString()}\nThank you for your purchase!`;
    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order ${orderId} has been downloaded`,
    });
  };

  const handleReorder = (order: any) => {
    let itemsAdded = 0;
    order.items.forEach((item: any) => {
      const product = {
        id: item.id,
        name: item.name,
        price: item.price,
        images: [item.image],
        frameType: item.frameType,
        frameMaterial: item.frameMaterial,
        color: item.color,
        description: `Reordered ${item.name}`,
        recommendedFaceShapes: [],
        recommendedVisionProblems: [],
        ratings: 5,
        reviewCount: 0,
        inStock: true,
        features: []
      };
      
      for (let i = 0; i < item.quantity; i++) {
        addToCart(product);
        itemsAdded++;
      }
    });

    toast({
      title: "Items Added to Cart",
      description: `${itemsAdded} items from order ${order.id} have been added to your cart`,
    });
    
    navigate('/cart');
  };

  return {
    handleViewDetails,
    handleDownloadInvoice,
    handleReorder,
  };
};
