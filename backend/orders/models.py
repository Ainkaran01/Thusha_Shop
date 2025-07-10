from django.db import models
from django.contrib.auth import get_user_model
from prescriptions.models import Prescription
from products.models import Product
from django.utils import timezone

User = get_user_model()

class Order(models.Model):
    ORDER_STATUS = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default="pending")
    payment_method = models.CharField(max_length=20, default="card")
    delivery_option = models.CharField(max_length=20, choices=[("home", "Home"), ("pickup", "Pickup")])
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status_updated_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.pk:
            old_status = Order.objects.get(pk=self.pk).status
            if old_status != self.status:
                self.status_updated_at = timezone.now()
        else:
            self.status_updated_at = timezone.now()  # for new order
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('order_number',) 

    def __str__(self):
        return f"Order {self.order_number} ({self.status})"

from django.db import models
from .models import Product, Prescription

class OrderItem(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    lens_option = models.JSONField(blank=True, null=True)
    prescription = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

class BillingInfo(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='billing')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"Billing Info for Order {self.order.order_number}"


class Delivery(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery')
    delivery_person = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'delivery', 'is_active': True},
        related_name='deliveries'
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery for Order {self.order.order_number} to {self.delivery_person.name}"
