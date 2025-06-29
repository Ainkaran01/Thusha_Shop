from rest_framework import serializers
from .models import Wishlist
from products.models import Product

class ProductNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'images', 'description']  # Add more if needed

class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductNestedSerializer(source='product', read_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'customer', 'product', 'product_details', 'added_at']
        read_only_fields = ['id', 'added_at', 'customer']
