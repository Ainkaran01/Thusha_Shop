from rest_framework import serializers
from doctors.serializers import DoctorProfileSerializer 
from .models import Appointment
from django.utils import timezone

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    doctor_details = serializers.SerializerMethodField(read_only=True)

    patient_name = serializers.CharField(source='patient.name', read_only=True)
    patient_email = serializers.EmailField(source='patient.email', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_specialization', 'doctor_details',
            'patient_name', 'patient_email',
            'date', 'time', 'reason', 'phone', 'status', 'created_at'
        ]
        extra_kwargs = {
            'doctor': {'write_only': True},
            # We allow status updates, so do NOT set 'read_only' on status here
        }

    def get_doctor_details(self, obj):
        return {
            'id': obj.doctor.id,
            'name': obj.doctor.user.name,
            'email': obj.doctor.user.email,
            'specialization': obj.doctor.specialization,
            'experience': obj.doctor.experience_years,
            'qualifications': obj.doctor.qualifications,
            'availability': obj.doctor.availability
        }

    def validate(self, data):
        if 'time' in data:
            # Normalize time string if needed
            data['time'] = data['time'].replace(' AM', '').replace(' PM', '').strip()

        if 'date' in data and data['date'] < timezone.now().date():
            raise serializers.ValidationError("Appointment date cannot be in the past.")

        if all(k in data for k in ['doctor', 'date', 'time']):
            conflicts = Appointment.objects.filter(
                doctor=data['doctor'],
                date=data['date'],
                time=data['time'],
                status__in=['confirmed', 'pending']
            )
            if self.instance:
                conflicts = conflicts.exclude(pk=self.instance.pk)
            if conflicts.exists():
                raise serializers.ValidationError("This time slot is already booked.")

        return data
    
    def update(self, instance, validated_data):
      print(f"Updating appointment {instance.id}. Current status: {instance.status}")
      print(f"Requested changes: {validated_data}")
    
    # Ensure status is explicitly set if provided
      if 'status' in validated_data:
        print(f"Explicitly setting status to: {validated_data['status']}")
    
        instance = super().update(instance, validated_data)
    
        print(f"Updated status: {instance.status}")
        return instance