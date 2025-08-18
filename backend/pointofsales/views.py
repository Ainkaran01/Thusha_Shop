from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import PointOfSaleSerializer
import csv
from django.http import HttpResponse
from .models import PointOfSale
from django.utils.timezone import now
from datetime import datetime

class PointOfSaleCreateView(APIView):
    permission_classes = [permissions.AllowAny]  # Adjust as needed

    def post(self, request):
        serializer = PointOfSaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Billing completed successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def export_pos_orders_csv(request):
    # Optional month filter: ?month=2025-07
    month_param = request.GET.get("month")

    queryset = PointOfSale.objects.prefetch_related("items", "items__product").all()

    if month_param:
        try:
            year, month = map(int, month_param.split("-"))
            queryset = queryset.filter(created_at__year=year, created_at__month=month)
        except:
            return HttpResponse("Invalid month format. Use YYYY-MM", status=400)

    response = HttpResponse(content_type="text/csv")
    filename = f"pos_orders_{month_param or now().strftime('%Y-%m')}.csv"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'

    writer = csv.writer(response)
    writer.writerow([
        "Order ID", "Customer Name", "Phone Number", "Email", "Date",
        "Product Details", "Total Amount", "Payment Method"
    ])

    for order in queryset:
        product_list = "; ".join(
            f"{item.product.name} x{item.quantity} @ Rs.{item.price}"
            for item in order.items.all()
        )
        writer.writerow([
            order.id,
            order.customer_name,
            order.phone_number,
            order.email,
            order.created_at.strftime("%Y-%m-%d %H:%M"),
            product_list,
            f"{order.total_amount:.2f}",
            order.payment_method.capitalize()
        ])
        

    return response