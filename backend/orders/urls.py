# urls.py
from django.urls import path
from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    OrderStatusUpdateView,
    RoleBasedOrderListView, RoleBasedOrderStatusUpdateView,
    AssignDeliveryView, ActiveDeliveryPersons,pending_order_count
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

]