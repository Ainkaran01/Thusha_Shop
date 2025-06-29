from django.urls import path
from .views import PrescriptionView,PrescriptionByUserView

urlpatterns = [
    path('', PrescriptionView.as_view()),            # /api/prescriptions/
    path('<int:pk>/', PrescriptionView.as_view()),   # /api/prescriptions/<id>/
    
]
