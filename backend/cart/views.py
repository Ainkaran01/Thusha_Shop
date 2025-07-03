from rest_framework import generics, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Cart
from .serializers import CartSerializer

class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Cart.objects.none()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['added_at']

    def get_queryset(self):
        return Cart.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        quantity = self.request.data.get("quantity", 1)

        try:
            quantity = int(quantity)
            if quantity <= 0:
                quantity = 1
        except ValueError:
            quantity = 1

        cart_item, created = Cart.objects.get_or_create(
            customer=self.request.user,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

    def get_serializer_context(self):
        return {'request': self.request}

    def delete(self, request):
        Cart.objects.filter(customer=request.user).delete()
        return Response({"message": "All items removed from cart."}, status=status.HTTP_204_NO_CONTENT)


class CartDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        try:
            cart_item = Cart.objects.get(customer=request.user, product_id=product_id)
            cart_item.delete()
            return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"error": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)


class CartQuantityUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, product_id):
        try:
            cart_item = Cart.objects.get(customer=request.user, product_id=product_id)
            new_quantity = request.data.get("quantity")

            if new_quantity is None:
                return Response({"error": "Quantity is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                new_quantity = int(new_quantity)
                if new_quantity <= 0:
                    cart_item.delete()
                    return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)
            except ValueError:
                return Response({"error": "Invalid quantity."}, status=status.HTTP_400_BAD_REQUEST)

            cart_item.quantity = new_quantity
            cart_item.save()
            return Response({"message": "Quantity updated."})
        except Cart.DoesNotExist:
            return Response({"error": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)
