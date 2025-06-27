from django.urls import path
from .views import AdminProfileDetailView

urlpatterns = [
    path('profile/', AdminProfileDetailView.as_view(), name='admin-profile'),
]