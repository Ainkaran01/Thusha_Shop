# products/views.py
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import FrameType, Category, Product, Accessory, Review
from .serializers import (
    FrameTypeSerializer,
    CategorySerializer,
    ProductSerializer,
    AccessorySerializer,
    ReviewSerializer
)
from django.contrib.auth import get_user_model
from rest_framework.filters import SearchFilter  
from rest_framework.exceptions import PermissionDenied  

User = get_user_model()

@api_view(['GET'])
def product_detail(request, pk):
    """Get detailed view of a single product"""
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def product_reviews(request, pk):
    product = get_object_or_404(Product, pk=pk)
    
    if request.method == 'POST':
        # Add product to the data so serializer can validate it exists
        data = request.data.copy()
        data['product'] = product.id
        
        serializer = ReviewSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return detailed error messages
        return Response({
            'error': 'Invalid data',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # GET request handling remains the same
    reviews = Review.objects.filter(product=product).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)
    
class FrameTypeViewSet(viewsets.ModelViewSet):
    queryset = FrameType.objects.all().order_by('-created_at')
    serializer_class = FrameTypeSerializer
    filter_backends = [SearchFilter]

class CategoryViewSet(viewsets.ModelViewSet):
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

    @action(detail=True, methods=["patch"], url_path="update-stock")
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

    @action(detail=True, methods=["patch"], url_path="update-stock")
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