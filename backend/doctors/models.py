from django.db import models
from core.models import User  # Import from the 'core' app

class DoctorProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'doctor'},
        related_name='doctor_profile'
    )
    specialization = models.CharField(max_length=255)
    experience_years = models.IntegerField()
    qualifications = models.CharField(max_length=255)
    biography = models.TextField()
    availability = models.JSONField(default=list, blank=True)  # Example: ["monday", "wednesday", "friday"]

    def __str__(self):
        return f"Dr. {self.user.name} - {self.specialization}"
