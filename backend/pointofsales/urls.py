from django.urls import path
from .views import PointOfSaleCreateView,export_pos_orders_csv

urlpatterns = [
    path('create/', PointOfSaleCreateView.as_view(), name='point-of-sale-create'),
    path('pos/', export_pos_orders_csv),
]   
