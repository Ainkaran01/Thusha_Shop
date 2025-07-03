from rest_framework import serializers
from .models import Cart
from products.models import Product

class ProductNestedSerializer(serializers.ModelSerializer):
    frame_type = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'images', 'frame_type', 'frame_material', 'colors']
    def get_frame_type(self, obj):
        return {
            "id": obj.frame_type.id if obj.frame_type else None,
            "name": obj.frame_type.name if obj.frame_type else "Unknown"
        }
    
class CartSerializer(serializers.ModelSerializer):
    product = ProductNestedSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True, source="product")
    quantity = serializers.IntegerField()

    class Meta:
        model = Cart
        fields = ['id', 'customer', 'product','product_id', 'quantity', 'added_at']
        read_only_fields = ['id', 'added_at', 'customer', 'quantity']
