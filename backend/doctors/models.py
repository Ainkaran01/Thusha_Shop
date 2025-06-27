from django.db import models
from core.models import User  # Import from the 'core' app

class DoctorProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'doctor'},
        related_name='doctor_profile'
    )
    id = models.AutoField(primary_key=True)
    specialization = models.CharField(max_length=255)
    experience_years = models.IntegerField()
    qualifications = models.CharField(max_length=255)
    biography = models.TextField()
    availability = models.JSONField(default=dict) 

    def __str__(self):
        return f"Dr. {self.user.name} - {self.specialization}"

    def is_available_on_day(self, day):
        """Check if doctor is available on a given day (e.g., 'monday')"""
        # Since availability is a list, we check if the day is in the list
        return day.lower() in self.availability
    
    def get_available_slots(self, date):
        """Get available time slots for a given date"""
        day_of_week = date.strftime('%A').lower()
        if not self.is_available_on_day(day_of_week):
            return []
            
        # Get all possible time slots
        all_slots = ['09:00', '10:30', '13:00', '15:30']
        
        # Get booked slots
        booked_slots = self.appointments.filter(
            date=date,
            status__in=['confirmed', 'pending']
        ).values_list('time', flat=True)
        
        return [slot for slot in all_slots if slot not in booked_slots]