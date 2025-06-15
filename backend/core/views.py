# core/views.py
from tokenize import TokenError
from .serializers import RegisterSerializer, VerifyOTPSerializer, ResendOTPSerializer
from datetime import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from .models import User, OTP,CustomerProfile
from .utils import send_otp_email
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

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                email = serializer.validated_data['email']
                name = serializer.validated_data['name']
                password = serializer.validated_data['password']
                role = serializer.validated_data.get('role', 'customer')

                # Create user
                user = User.objects.create_user(
                    email=email,
                    name=name,
                    password=password,
                    role=role,
                    is_active=False
                )

                otp = OTP.create_otp(user)
                send_otp_email(user.email, otp.code)

                return Response({
                    "message": "OTP sent to your email",
                    "email": user.email
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

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
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