from rest_framework import serializers
from .models import AdminProfile
from core.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role']

class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = '__all__'
        read_only_fields = ('user',)
        extra_kwargs = {
            'image': {'required': False}
        }

    def update(self, instance, validated_data):
        # Handle file upload separately
        if 'image' in validated_data:
            instance.image = validated_data.pop('image')
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance

    