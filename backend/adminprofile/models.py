from django.db import models
from core.models import User
from django.core.validators import FileExtensionValidator

class AdminProfile(models.Model):    
    SHOP_STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'admin'},
        related_name='admin_profile'
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    customer_support_phone = models.CharField(max_length=20, blank=True, null=True)
    shop_status = models.CharField(max_length=10, choices=SHOP_STATUS_CHOICES, default='open')
    address = models.TextField(blank=True, null=True)
    image = models.ImageField(
        upload_to='admin_profile_images/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )

    def __str__(self):
        return f"Admin Profile for {self.user.name}"
    
