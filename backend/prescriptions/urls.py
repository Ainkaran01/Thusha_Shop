from django.urls import path
from .views import PrescriptionView

urlpatterns = [
    path('', PrescriptionView.as_view()),            # /api/prescriptions/
    path('<int:pk>/', PrescriptionView.as_view()),   # /api/prescriptions/<id>/
    
]
