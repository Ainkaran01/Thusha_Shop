from django.shortcuts import render
from rest_framework import viewsets,parsers,status
from .models import FrameType,Category,Product,Accessory
from rest_framework.permissions import IsAuthenticated
from .serializers import FrameTypeSerializer,CategorySerializer, ProductSerializer,AccessorySerializer
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied


User = get_user_model()

class FrameTypeViewSet(viewsets.ModelViewSet):
    queryset = FrameType.objects.all().order_by('-created_at')
    serializer_class = FrameTypeSerializer
    filter_backends = [SearchFilter]

class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('-created_at')
    serializer_class = CategorySerializer
    filter_backends = [SearchFilter]



class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category', 'frame_type').order_by('-created_at')
    serializer_class = ProductSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    filter_backends = [SearchFilter]

    def create(self, request, *args, **kwargs):
        mutable_data = request.data.copy()
        mutable_data.setlist('images', request.FILES.getlist('images'))

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=["patch"], url_path="update-stock", parser_classes=[JSONParser])
    def update_stock(self, request, pk=None):
        product = self.get_object()
        new_stock = request.data.get("stock")

        if new_stock is None:
            return Response({"error": "Stock value is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product.stock = int(new_stock)
            product.save()
            return Response({"message": "Stock updated successfully."})
        except ValueError:
            return Response({"error": "Invalid stock value."}, status=status.HTTP_400_BAD_REQUEST)
        
class AccessoryViewSet(viewsets.ModelViewSet):
    
    queryset = Accessory.objects.all().select_related('category', 'manufacturer').order_by('-created_at')
    serializer_class = AccessorySerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    filter_backends = [SearchFilter]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role not in ['manufacturer', 'admin']:
            raise PermissionDenied("Only manufacturers can create accessories.")
        serializer.save(manufacturer=self.request.user)

    @action(detail=True, methods=["patch"], url_path="update-stock", parser_classes=[JSONParser])
    def update_stock(self, request, pk=None):
        accessory = self.get_object()
        new_stock = request.data.get("stock")

        if new_stock is None:
            return Response({"error": "Stock value is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            accessory.stock = int(new_stock)
            accessory.save()
            return Response({"message": "Stock updated successfully."})
        except ValueError:
            return Response({"error": "Invalid stock value."}, status=status.HTTP_400_BAD_REQUEST)        