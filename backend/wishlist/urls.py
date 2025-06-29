from django.urls import path
from .views import WishlistListCreateView, WishlistDeleteView

urlpatterns = [
    path('', WishlistListCreateView.as_view(), name='wishlist-list-create'),  # GET and POST
    path('<int:product_id>/', WishlistDeleteView.as_view(), name='wishlist-delete'),  # DELETE by product_id
    path('accessory/<int:accessory_id>/', WishlistDeleteView.as_view(), name='wishlist-delete-accessory'),
]
