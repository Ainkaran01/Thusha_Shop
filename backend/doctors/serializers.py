from rest_framework import serializers
from .models import DoctorProfile

class DoctorProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name')  # writable now
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'name', 'email', # name is writable, email read-only
            'id', 
            'specialization',
            'experience_years',
            'qualifications',
            'biography',
            'availability',
        ]
        
    depth = 1  
    def get_name(self, obj):
        return obj.user.name 

    def update(self, instance, validated_data):
        # Update User.name
        user_data = validated_data.pop('user', {})
        if 'name' in user_data:
            instance.user.name = user_data['name']
            instance.user.save()

        # Update DoctorProfile fields
        return super().update(instance, validated_data)
