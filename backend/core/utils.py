# users/utils.py
from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, otp_code):
    subject = "Verify Your Email - Thusha Optical"
    message = f"Your verification code is: {otp_code}"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    
    send_mail(subject, message, email_from, recipient_list)



def send_staff_welcome_email(email, name, password):
    
    subject = 'Welcome to Our Platform - Staff Account Created'
    message = f"""
    Hello {name},
    
    Your staff account has been created by the administrator.
    
    Here are your login credentials:
    Email: {email}
    Password: {password}
    
    Please log in and change your password immediately for security.
    
    
    Best regards,
    The Admin Team
    """
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )  