from django.db import models
from core.models import User
from django.core.files.storage import FileSystemStorage
import os


class FrameType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    frame_type = models.ForeignKey(FrameType, on_delete=models.SET_NULL, null=True, blank=True)
    size = models.CharField(max_length=15,blank=True)  # S / M / L
    weight = models.FloatField()
    stock = models.IntegerField()
    frame_material = models.CharField(max_length=100, blank=True)

    manufacturer = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'manufacturer'}, null=True, blank=True
    )

    images = models.JSONField(default=list)
    face_shapes = models.JSONField(default=list, blank=True)
    vision_problems = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    colors = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    


class Accessory(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='accessories/', null=True, blank=True)
    weight = models.FloatField()
    manufacturer = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={'role': 'manufacturer'}, null=True, blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Accessories"
        ordering = ['-created_at']



class Review(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    title = models.CharField(max_length=100, blank=True, null=True)  # Optional
    comment = models.TextField(blank=True, null=True)  # Optional
    created_at = models.DateTimeField(auto_now_add=True)  # Auto-set on creation


    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"

import os
from uuid import uuid4

def product_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid4().hex}.{ext}"
    return os.path.join('product_images', str(instance.product.id), filename)