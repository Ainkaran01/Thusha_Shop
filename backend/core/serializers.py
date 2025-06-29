# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=[
            ('customer', 'Customer'),
            ('doctor', 'Doctor'),
            ('admin', 'Admin'),
            ('delivery', 'Delivery'),
            ('manufacturer', 'Manufacturer'),
        ],
        default='customer'
    )

    # def validate_email(self, value):
    #     User = get_user_model()
    #     if User.objects.filter(email=value).exists():
    #         raise serializers.ValidationError("A user with this email already exists.")
    #     return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return validated_data  # Return raw data; view will handle actual creation'
    

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get('email')
        otp = data.get('otp')

        if not email or not otp:
            raise serializers.ValidationError("Email and OTP are required.")
        
        return data     



class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        return value

 # core/serializers.py
from rest_framework import serializers
from .models import CustomerProfile


class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=False)

    class Meta:
        model = CustomerProfile
        fields = [
            'name',  # ✅ Now included
            'phone_number',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'zip_code',
            'country',
        ] 
        read_only_fields = ['user']  # Don't allow changing user directly

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if 'name' in user_data:
            instance.user.name = user_data['name']
            instance.user.save(update_fields=['name'])

        return super().update(instance, validated_data)
    

# ForgotPasswordSerializer

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError("No active user with this email exists.")
        return value

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=6)
