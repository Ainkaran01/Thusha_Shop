from rest_framework import serializers
from .models import PointOfSale, PointOfSaleItem
from products.models import Product
from decimal import Decimal

class PointOfSaleItemSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        model = PointOfSaleItem
        fields = ['product', 'quantity', 'price']


class PointOfSaleSerializer(serializers.ModelSerializer):
    items = PointOfSaleItemSerializer(many=True)

    class Meta:
        model = PointOfSale
        fields = ['id', 'customer_name', 'phone_number', 'email', 'total_amount', 'payment_method', 'items', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        pos = PointOfSale.objects.create(**validated_data)

        for item_data in items_data:
            product_id = item_data['product'].id if isinstance(item_data['product'], Product) else item_data['product']
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {product_id} does not exist")

            quantity = item_data['quantity']

            if product.stock < quantity:
                raise serializers.ValidationError(f"Not enough stock for {product.name}")

            product.stock -= quantity
            product.save()

            # Create POS item with the product instance
            PointOfSaleItem.objects.create(
                pos=pos,
                product=product,
                quantity=quantity,
                price=item_data['price']
            )

        return pos
