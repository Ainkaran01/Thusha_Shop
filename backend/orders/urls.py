# urls.py
from django.urls import path
from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    OrderStatusUpdateView,
    RoleBasedOrderListView, RoleBasedOrderStatusUpdateView,
    AssignDeliveryView, ActiveDeliveryPersons,pending_order_count,
    sales_overview ,total_sales ,monthly_revenue
    )

urlpatterns = [
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('list/', OrderListView.as_view(), name='order-list'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
    path('<str:order_number>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
    
    path('role/orders/', RoleBasedOrderListView.as_view(), name='role-order-list'),
    path('role/<str:order_number>/status/', RoleBasedOrderStatusUpdateView.as_view(), name='role-order-status-update'),

    path('role/assign-delivery/', AssignDeliveryView.as_view(), name='assign-delivery'),
    path('role/delivery-persons/', ActiveDeliveryPersons.as_view(), name='delivery-person-list'),
    path('role/pending-order-count/', pending_order_count, name='pending-order-count'),
    path('role/total-sales/', total_sales, name='total-sales'),
    path('role/monthly-revenue/', monthly_revenue, name='monthly-revenue'),
    path('role/sales-overview/',sales_overview, name='sales-overview'),
]