from django.urls import path
from .views import PrescriptionView,get_prescription_details

urlpatterns = [
    path('', PrescriptionView.as_view()),            # /api/prescriptions/
    path('<int:pk>/', PrescriptionView.as_view()),   # /api/prescriptions/<id>/
    path('prescription/<int:prescription_id>/', get_prescription_details, name='prescription-details'),
]
