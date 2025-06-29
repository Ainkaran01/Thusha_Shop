from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Wishlist.objects.none()  # fallback queryset
    filter_backends = []  # fix error

    def get_queryset(self):
        return Wishlist.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

    def delete(self, request):
        Wishlist.objects.filter(customer=request.user).delete()
        return Response({"message": "All items removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)


class WishlistDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        try:
            wishlist_item = Wishlist.objects.get(customer=request.user, product_id=product_id)
            wishlist_item.delete()
            return Response({"message": "Item removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response({"error": "Item not found in wishlist."}, status=status.HTTP_404_NOT_FOUND)
