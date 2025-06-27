from django.template import TemplateDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import Order
from .serializers import OrderSerializer
import json


class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        print("Incoming data:", json.dumps(data, indent=2))

        serializer = OrderSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            try:
                order = serializer.save()
                print(f"Order {order.id} created with {order.items.count()} items")

                try:
                    self.send_order_confirmation_email(order)
                except Exception as email_error:
                    print(f"Email failed but order created: {str(email_error)}")

                return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

            except ValidationError as ve:
                print("Validation during save:", ve.detail)
                return Response({"error": "Invalid data", "details": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print("Order creation failed:", str(e))
                return Response({"error": "Order processing failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print("Initial validation failed:", serializer.errors)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def send_order_confirmation_email(self, order):
        subject = f"Order Confirmation - {order.order_number}"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [order.billing.email]

        try:
            html_content = render_to_string('emails/order_confirmation.html', {
                'order': order,
            })
            text_content = strip_tags(html_content)

            email = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
            email.attach_alternative(html_content, "text/html")
            email.send()
        except TemplateDoesNotExist:
            print("Email template not found at: emails/order_confirmation.html")
            message = f"Thank you for your order #{order.order_number}"
            from django.core.mail import send_mail
            send_mail(subject, message, from_email, recipient_list)

class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)
        new_status = request.data.get("status")

        valid_statuses = [choice[0] for choice in Order.ORDER_STATUS]
        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Choose from {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        try:
            self.send_status_update_email(order)
        except Exception as e:
            print(f"Failed to send status update email: {e}")

        return Response({"message": "Order status updated", "status": order.status})

    def send_status_update_email(self, order):
        subject = f"Order Status Updated - {order.order_number}"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [order.billing.email]

        try:
            html_content = render_to_string('emails/status_update.html', {
                'order': order,
                'new_status': order.get_status_display()
            })
            text_content = strip_tags(html_content)

            email = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
            email.attach_alternative(html_content, "text/html")
            email.send()
        except TemplateDoesNotExist:
            print("Email template not found at: emails/status_update.html")
            message = f"Your order #{order.order_number} status has been updated to {order.get_status_display()}"
            from django.core.mail import send_mail
            send_mail(subject, message, from_email, recipient_list)

