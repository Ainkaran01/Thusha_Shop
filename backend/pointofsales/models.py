from django.db import models
from core.models import User
from products.models import Product  # adjust based on your project structure


class PointOfSale(models.Model):
    customer_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=[("cash", "Cash"), ("card", "Card")])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"POS #{self.id} - {self.customer_name}"


class PointOfSaleItem(models.Model):
    pos = models.ForeignKey(PointOfSale, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # price at the time of sale

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
