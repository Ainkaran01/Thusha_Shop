# core/views.py
from tokenize import TokenError
from .serializers import RegisterSerializer, VerifyOTPSerializer, ResendOTPSerializer
from datetime import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from .models import User, OTP,CustomerProfile
from .utils import send_otp_email,send_staff_welcome_email
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.throttling import AnonRateThrottle
User = get_user_model()
from doctors.models import DoctorProfile  
from django.core.mail import send_mail
from .serializers import (
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer
)
from datetime import timedelta

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                email = serializer.validated_data['email']
                name = serializer.validated_data['name']
                password = serializer.validated_data['password']
                role = serializer.validated_data.get('role', 'customer')

                 # Delete unverified customer if already exists
                if role == 'customer':
                    existing_user = User.objects.filter(email=email).first()
                    if existing_user:
                        if not existing_user.is_active:
                            existing_user.delete()  # 👈 delete immediately
                        else:
                            return Response({
                                "error": "A user with this email already exists"
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                 # Determine if user should be active immediately
                is_staff_user = role in ['doctor', 'delivery', 'manufacturer']
                is_active = True if is_staff_user else False

                # Create user
                user = User.objects.create_user(
                    email=email,
                    name=name,
                    password=password,
                    role=role,
                    is_active=is_active
                )

                 #  AUTO CREATE PROFILE FOR DOCTOR 
                if role == 'doctor':
                    DoctorProfile.objects.create(
                        user=user,
                        specialization='',
                        experience_years=0,
                        qualifications='',
                        biography='',
                        availability={
                        "monday": False,
                        "tuesday": False,
                        "wednesday": False,
                        "thursday": False,
                        "friday": False,
                        "saturday": False,
                        "sunday": False
                        }

                    )

                # If it's a customer, send OTP
                if not is_staff_user:
                    otp = OTP.create_otp(user)
                    send_otp_email(user.email, otp.code)
                    return Response({
                        "message": "OTP sent to your email",
                        "email": user.email
                    }, status=status.HTTP_201_CREATED)

                else:
                    send_staff_welcome_email(email, name, password)

                # Generate tokens for staff
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "user": {
                            "id": user.id,
                            "email": user.email,
                            "name": user.name,
                            "role": user.role
                        },
                        "message": "Staff account created successfully"
                    }, status=status.HTTP_201_CREATED)
                
            except IntegrityError:
                return Response(
                    {"error": "A user with this email already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                # Delete user if something goes wrong
                if 'user' in locals():
                    user.delete()
                return Response(
                    {"error": "Failed to complete registration", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            
            try:
                user = User.objects.get(email=email)
                otp_entry = OTP.objects.filter(user=user).latest('created_at')

                if timezone.now() > otp_entry.expires_at:
                    return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

                if otp == otp_entry.code:
                    user.is_active = True
                    user.save()
                    
                    # Create empty profile
                    CustomerProfile.objects.get_or_create(
                        user=user,
                        defaults={
                            'phone_number': '',
                            'address_line1': '',
                            'address_line2': '',
                            'city': '',
                            'state': '',
                            'zip_code': '',
                            'country': ''
                        }
                    )
                    
                    # Generate tokens
                    refresh = RefreshToken.for_user(user)
                    otp_entry.delete()  # Delete used OTP
                    
                    return Response({
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "user": {
                            "id": user.id,
                            "email": user.email,
                            "name": user.name,
                            "role": user.role
                        }
                    }, status=status.HTTP_200_OK)
                    
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
                
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                if user.is_active:
                    return Response({"error": "User already verified"}, status=status.HTTP_400_BAD_REQUEST)

                otp = OTP.create_otp(user)
                send_otp_email(user.email, otp.code)

                return Response({
                    "message": "New OTP sent to your email",
                    "email": user.email
                }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# users/views.py
class LoginView(APIView):
    throttle_classes = [AnonRateThrottle]
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"error": "Account not activated"},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        update_last_login(None, user)
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user_data
        })

# core/views.py

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = CustomerProfile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile)
            return Response({
                **serializer.data,
                'email': request.user.email
            })
        except CustomerProfile.DoesNotExist:
            raise NotFound("Profile not found")

    def patch(self, request):
        try:
            profile = CustomerProfile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                
                return Response({
                    **serializer.data,
                    'email': request.user.email
                }, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except CustomerProfile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class LogoutView(APIView):
    permission_classes = []  # Remove authentication requirement for logout

    def post(self, request):
        refresh_token = request.data.get("refresh")
        
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except TokenError as e:
            return Response(
                {"detail": f"Invalid token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')
        
        # Validate required fields
        if not current_password or not new_password:
            return Response(
                {"message": "Both current and new password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify current password
        if not check_password(current_password, request.user.password):
            return Response(
                {"message": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate new password strength
        if len(new_password) < 6:
            return Response(
                {"message": "New password must be at least 8 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_password == current_password:
            return Response(
                {"message": "New password must be different from current password"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update password
        request.user.set_password(new_password)
        request.user.save()
        
        # Maintain session for logged in users
        update_session_auth_hash(request, request.user)
        
        return Response(
            {"message": "Password updated successfully"},
            status=status.HTTP_200_OK
        )        


from rest_framework.decorators import api_view, authentication_classes
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def verify_token(request):
    if not request.user.is_authenticated:
        return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'valid': True,
        'user': {
            'id': request.user.id,
            'email': request.user.email,
            'name': request.user.name,
            'role': request.user.role
        }
    })

from rest_framework.decorators import  permission_classes


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.models import User  # your User model path

@api_view(['GET'])
def get_active_users_by_role(request):
    """
    Get list of active users grouped by role
    Shows: Doctor, Customer, Delivery, Manufacturer
    """
    role_mapping = {
        'doctor': 'Doctor',
        'customer': 'Customer',
        'delivery': 'Delivery',
        'manufacturer': 'Manufacturer',
    }

    users = User.objects.filter( role__in=role_mapping.keys()).order_by("id")

    data = []
    for user in users:
        data.append({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': role_mapping.get(user.role, user.role),
            'is_active': user.is_active
        })

    return Response(data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
def deactivate_user(request, user_id):
    """Deactivate any user (doctor, customer, delivery, manufacturer) by setting is_active=False"""
    role_mapping = {
        'doctor': 'Doctor',
        'customer': 'Customer',
        'delivery': 'Delivery',
        'manufacturer': 'Manufacturer',
    }

    try:
        user = User.objects.get(id=user_id)
        if user.role not in role_mapping:
            return Response(
                {'error': 'Invalid role for deactivation'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = False
        user.save()
        return Response(
            {
                'message': f"{role_mapping.get(user.role)} deactivated successfully",
                'user_id': user.id,
                'role': role_mapping.get(user.role),
                'is_active': user.is_active
            },
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PATCH'])
def activate_user(request, user_id):
    """Activate any user (doctor, customer, delivery, manufacturer) by setting is_active=True"""
    role_mapping = {
        'doctor': 'Doctor',
        'customer': 'Customer',
        'delivery': 'Delivery',
        'manufacturer': 'Manufacturer',
    }

    try:
        user = User.objects.get(id=user_id)
        if user.role not in role_mapping:
            return Response(
                {'error': 'Invalid role for activation'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = True
        user.save()
        return Response(
            {
                'message': f"{role_mapping.get(user.role)} activated successfully",
                'user_id': user.id,
                'role': role_mapping.get(user.role),
                'is_active': user.is_active
            },
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    #forgot password views
class ForgotPasswordSendOTPView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        # Create and send OTP
        otp = OTP.create_otp(user)
       
        try:
            send_mail(
                subject="Your Password Reset OTP",
                message=f"Your OTP code is: {otp.code}\nThis code will expire in 5 minutes.",
                from_email="thushaopticals@gmail.com",
                recipient_list=[email],
                fail_silently=False,
            )
            return Response(
                {"message": "OTP has been sent to your email"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"message": "Failed to send OTP. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ForgotPasswordVerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp']  

        try:
            user = User.objects.get(email=email)
            otp = OTP.objects.get(
                user=user,
                code=otp_code,
                expires_at__gt=timezone.now()
            )
            return Response(
                {
                    "verified": True,  
                    "message": "OTP verified successfully"
                },
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"verified": False, "message": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except OTP.DoesNotExist:
            return Response(
                {"verified": False, "message": "Invalid or expired OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"verified": False, "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class ForgotPasswordResetView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except OTP.DoesNotExist:
            return Response(
                {"message": "Invalid or expired OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password reset successfully"},
            status=status.HTTP_200_OK
        )