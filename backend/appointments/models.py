from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from doctors.models import DoctorProfile
from django.core.validators import MinLengthValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import timedelta
from django.db.models.signals import pre_save  
from django.dispatch import receiver 
User = get_user_model()

class Appointment(models.Model):
    TIME_SLOT_CHOICES = [
        ('09:00', '09:00 AM'),
        ('10:30', '10:30 AM'),
        ('13:00', '01:00 PM'),
        ('15:30', '03:30 PM'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    date = models.DateField()
    time = models.CharField(
        max_length=5,
        choices=TIME_SLOT_CHOICES
    )
    reason = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(10)]
    )
    phone = models.CharField(
        max_length=20,
        validators=[MinLengthValidator(10)]
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='confirmed'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('doctor', 'date', 'time')
        ordering = ['-date', 'time']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'

    def __str__(self):
        return f"{self.patient.get_full_name()} with Dr. {self.doctor.user.get_full_name()} on {self.date} at {self.get_time_display()}"
    
    def clean(self):
        """Additional model validation"""
        if self.date < timezone.now().date():
            raise ValidationError("Appointment date cannot be in the past")
        if self.date > (timezone.now().date() + timedelta(days=60)):
            raise ValidationError("Cannot book more than 60 days in advance")
    
    def is_past_due(self):
        return self.date < timezone.now().date()
    
    def get_time_display_12hr(self):
        """Returns time in 12-hour format with AM/PM"""
        return dict(self.TIME_SLOT_CHOICES).get(self.time, self.time)
    
# Signal registration
@receiver(pre_save, sender=Appointment)
def update_appointment_status(sender, instance, **kwargs):
    """Automatically update status for past appointments"""
    if instance.date < timezone.now().date():
        instance.status = 'completed'

 

