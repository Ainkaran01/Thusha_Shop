from django.urls import path
from .views import PointOfSaleCreateView

urlpatterns = [
    path('create/', PointOfSaleCreateView.as_view(), name='point-of-sale-create'),
]
