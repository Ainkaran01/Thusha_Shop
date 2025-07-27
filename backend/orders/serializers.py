from rest_framework import serializers
from prescriptions.models import Prescription
from .models import Order, OrderItem, BillingInfo, Delivery
from products.models import Product
from decimal import Decimal
from django.contrib.auth import get_user_model
from prescriptions.serializers import PrescriptionSerializer
from products.serializers import ProductSerializer

User = get_user_model()

class BillingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingInfo
        exclude = ['order']
        extra_kwargs = {
            'address2': {'required': False, 'allow_null': True}
        }

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=False)
    product_name = serializers.CharField(read_only=True)
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.01')
    )

    product = serializers.SerializerMethodField(read_only=True)

    # Make prescription writable!
    prescription = serializers.PrimaryKeyRelatedField(
        queryset=Prescription.objects.all(),
        required=False,
        allow_null=True
    )

    # Optional: Include full details in response
    prescription_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'product',
            'product_id',
            'product_name',
            'quantity',
            'price',
            'lens_option',
            'prescription',
            'prescription_details',
        ]
        extra_kwargs = {
            'lens_option': {'required': False, 'allow_null': True}
        }

    def get_product(self, obj):
        from products.serializers import ProductSerializer
        return ProductSerializer(obj.product, context=self.context).data

    def get_prescription_details(self, obj):
        if obj.prescription:
            from prescriptions.serializers import PrescriptionSerializer
            return PrescriptionSerializer(obj.prescription, context=self.context).data
        return None

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    billing = BillingInfoSerializer()
    assigned_delivery_person = serializers.SerializerMethodField()
    order_number = serializers.CharField(required=True)
    delivery = serializers.SerializerMethodField()

    def get_delivery(self, obj):
        # ✅ Safely import it here
        from .serializers import DeliverySerializer
        if hasattr(obj, "delivery"):
            return DeliverySerializer(obj.delivery, context=self.context).data
        return None
    
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
            'created_at',
            'assigned_delivery_person',
            'status_updated_at',
            'delivery', 
        ]
        read_only_fields = ['created_at', 'status']
        extra_kwargs = {
            'user': {'required': False},
            'total_price': {'min_value': Decimal('0.01')}
        }
    
    def get_assigned_delivery_person(self, obj):
        try:
            if hasattr(obj, "delivery") and obj.delivery and obj.delivery.delivery_person:
                person = obj.delivery.delivery_person
                return {
                    "id": person.id,
                    "name": person.name or person.get_full_name() or person.username or "Unnamed",
                    "email": person.email
                }
        except Exception as e:
            print(f"Delivery person serialization error: {e}")
        return None


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
    
class DeliverySerializer(serializers.ModelSerializer):
    delivery_person = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='delivery', is_active=True)
    )
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order')
    delivery_person_name = serializers.CharField(source='delivery_person.name', read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', 'order_id', 'delivery_person', 'delivery_person_name', 'assigned_at']
        read_only_fields = ['assigned_at']
