from django.urls import path
from .views import CartListCreateView, CartDeleteView, CartQuantityUpdateView

urlpatterns = [
    path('', CartListCreateView.as_view(), name='cart-list-create'),
    path('<int:product_id>/', CartDeleteView.as_view(), name='cart-delete'),
    path('<int:product_id>/update/', CartQuantityUpdateView.as_view(), name='cart-update-quantity'),
]
