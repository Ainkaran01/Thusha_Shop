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
from rest_framework.decorators import api_view, permission_classes
import json
from django.db.models import Sum
from django.utils import timezone
from django.db.models.functions import ExtractMonth, ExtractYear

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

                return Response(OrderSerializer(order, context={'request': request}).data, status=status.HTTP_201_CREATED)


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
        serializer = OrderSerializer(orders, many=True, context={'request': request})
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

from core.permission import IsAdmin, IsManufacturer, IsDelivery

def get_orders_for_user(user):
    if user.role == "admin":
        return Order.objects.all().order_by('-created_at')
    
    elif user.role == "manufacturer":
        return Order.objects.all().order_by('-created_at')
    
    elif user.role == "delivery":
        # Future logic: if orders are assigned to delivery user, filter by that
        return Order.objects.all().order_by('-created_at')  # or add filter later

    return Order.objects.none()


class RoleBasedOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = get_orders_for_user(request.user)
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)
    
class RoleBasedOrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)
        new_status = request.data.get("status")

        if new_status not in [choice[0] for choice in Order.ORDER_STATUS]:
            return Response({"error": "Invalid status"}, status=400)

        # Permission check (can improve per role)
        if request.user.role == 'manufacturer':
           pass
        elif request.user.role == 'delivery':
            # Add delivery logic later (e.g., check assigned delivery)
            pass

        elif request.user.role == 'admin':
            pass  # Admin can always edit

        else:
            return Response({"error": "Permission denied"}, status=403)

        order.status = new_status
        order.save()

        self.send_status_update_email(order)

        return Response({
            "message": f"Status updated to {new_status}",
            "order_number": order.order_number
        })
    
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
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def pending_order_count(request):
    count = Order.objects.filter(status="pending").count()
    return Response({"pending_orders": count})        

from .serializers import DeliverySerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class AssignDeliveryView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = DeliverySerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.validated_data['order']
            if hasattr(order, 'delivery'):
                return Response({"error": "Delivery already assigned for this order."}, status=400)

            delivery = serializer.save()
            order.status = "shipped"
            order.save()

            # ✅ Send emails to both
            self.send_assignment_emails(order, delivery)

            return Response(DeliverySerializer(delivery).data, status=201)

        return Response(serializer.errors, status=400)

    def send_assignment_emails(self, order, delivery):
        from_email = settings.DEFAULT_FROM_EMAIL
        customer_email = order.billing.email
        delivery_email = delivery.delivery_person.email

        # 1. Email to customer
        try:
            subject = f"Order Status Update - #{order.order_number}"
            html_customer = render_to_string("emails/status_update.html", {
                "order": order,
                "new_status": order.get_status_display(),
            })
            text_customer = strip_tags(html_customer)

            email_customer = EmailMultiAlternatives(subject, text_customer, from_email, [customer_email])
            email_customer.attach_alternative(html_customer, "text/html")
            email_customer.send()
        except Exception as e:
            print("Failed to send customer email:", e)

        # 2. Email to delivery person
        try:
            subject = f"New Delivery Assigned - Order #{order.order_number}"
            html_delivery = render_to_string("emails/delivery_person_assignment.html", {
                "order": order,
                "delivery_person": delivery.delivery_person,
            })
            text_delivery = strip_tags(html_delivery)

            email_delivery = EmailMultiAlternatives(subject, text_delivery, from_email, [delivery_email])
            email_delivery.attach_alternative(html_delivery, "text/html")
            email_delivery.send()
        except Exception as e:
            print("Failed to send delivery email:", e)

class ActiveDeliveryPersons(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = User.objects.filter(role='delivery', is_active=True)
        data = [{'id': u.id, 'name': u.name, 'email': u.email} for u in users]
        return Response(data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def total_sales(request):
    now = timezone.now()
    start_of_current_month = now.replace(day=1)
    
    current_total = Order.objects.filter(
        status='delivered'
    ).aggregate(total=Sum('total_price'))['total'] or 0

    previous_total = Order.objects.filter(
        status='delivered',
        created_at__lt=start_of_current_month
    ).aggregate(total=Sum('total_price'))['total'] or 0

    return Response({
        'total_sales': float(current_total),
        'last_month_sales': float(previous_total)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def monthly_revenue(request):
    now = timezone.now()
    start_of_this_month = now.replace(day=1)
    start_of_last_month = (start_of_this_month - timezone.timedelta(days=1)).replace(day=1)

    current = Order.objects.filter(
        status='delivered',
        created_at__gte=start_of_this_month
    ).aggregate(total=Sum('total_price'))['total'] or 0

    previous = Order.objects.filter(
        status='delivered',
        created_at__gte=start_of_last_month,
        created_at__lt=start_of_this_month
    ).aggregate(total=Sum('total_price'))['total'] or 0

    return Response({
        'monthly_revenue': float(current),
        'last_month_revenue': float(previous)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def sales_overview(request):
    # Get current year
    now = timezone.now()
    start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Query monthly sales data for delivered orders
    monthly_sales = Order.objects.filter(
        status='delivered',
        created_at__gte=start_of_year
    ).annotate(
        month=ExtractMonth('created_at'),
        year=ExtractYear('created_at')
    ).values('month', 'year').annotate(
        revenue=Sum('total_price')
    ).order_by('year', 'month')
    
    # Format the data for the chart
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    # Initialize all months with 0 revenue
    result = [{'month': month, 'revenue': 0.0} for month in month_names]
    
    # Update with actual data
    for sale in monthly_sales:
        month_index = sale['month'] - 1
        if month_index < len(result):
            result[month_index]['revenue'] = float(sale['revenue'] or 0.0)
    
    return Response(result)