from django.db import models

# Create your models here.
from django.db import models
from core.models import User
from products.models import Product


class Wishlist(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlists")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('customer', 'product')

    def __str__(self):
        return f"{self.customer.email} - {self.product.name}"
