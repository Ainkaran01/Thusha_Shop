from rest_framework import serializers
from .models import Order, OrderItem, BillingInfo
from products.models import Product
from decimal import Decimal

class BillingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingInfo
        exclude = ['order']
        extra_kwargs = {
            'address2': {'required': False, 'allow_null': True}
        }

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)  # Frontend sends product_id
    product_name = serializers.CharField(read_only=True)
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.01')
    )

    class Meta:
        model = OrderItem
        fields = [
            'product_id',
            'product_name',
            'quantity',
            'price',
            'lens_option',
            'prescription',
        ]
        extra_kwargs = {
            'prescription': {'required': False, 'allow_null': True},
            'lens_option': {'required': False, 'allow_null': True}
        }

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    billing = BillingInfoSerializer()
    order_number = serializers.CharField(required=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'order_number',
            'delivery_option',
            'payment_method',
            'total_price',
            'status',
            'items',
            'billing',
            'created_at'
        ]
        read_only_fields = ['created_at', 'status']
        extra_kwargs = {
            'user': {'required': False},
            'total_price': {'min_value': Decimal('0.01')}
        }

    def validate(self, data):
        # Additional validation for items
        if not data.get('items'):
            raise serializers.ValidationError({"items": "At least one item is required"})
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        billing_data = validated_data.pop('billing', {})

        # Create Order
        order = Order.objects.create(**validated_data)

        # Create BillingInfo
        BillingInfo.objects.create(order=order, **billing_data)

        # Create OrderItems with error handling
        order_items = []
        for item_data in items_data:
            try:
                product_id = item_data.pop('product_id')
                product = Product.objects.get(id=product_id)
                
                order_items.append(OrderItem(
                    order=order,
                    product=product,
                    product_name=product.name,
                    **item_data
                ))
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    {"product": f"Product with ID {product_id} does not exist"}
                )
            except KeyError:
                raise serializers.ValidationError(
                    {"product_id": "This field is required"}
                )

        # Use bulk_create for better performance
        OrderItem.objects.bulk_create(order_items)
        
        return order