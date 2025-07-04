# core/urls.py 
from django.urls import path
from .views import RegisterView, VerifyOTPView, ResendOTPView,  LoginView,ProfileView,LogoutView,ChangePasswordView,verify_token ,get_active_users_by_role, deactivate_user,activate_user
from rest_framework_simplejwt.views import TokenRefreshView
from .views import ForgotPasswordSendOTPView,ForgotPasswordVerifyOTPView,ForgotPasswordResetView,CustomerCountView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('verify-token/', verify_token, name='verify-token'),

    path("forgot-password/send-otp/", ForgotPasswordSendOTPView.as_view(), name="forgot-password-send-otp"),
    path("forgot-password/verify-otp/", ForgotPasswordVerifyOTPView.as_view(), name="forgot-password-verify-otp"),
    path("forgot-password/reset/", ForgotPasswordResetView.as_view(), name="forgot-password-reset"),

    path('users/', get_active_users_by_role, name='get_active_users'),
    path('users/<int:user_id>/deactivate/', deactivate_user, name='deactivate_user'),
    path('users/<int:user_id>/activate/', activate_user, name='activate_user'),
     path("users/count/", CustomerCountView.as_view(), name="customer-count"),
]