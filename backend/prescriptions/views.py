from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from .models import Prescription
from .serializers import PrescriptionSerializer

class PrescriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        user = request.user

        # Single prescription detail
        if pk:
            try:
                prescription = Prescription.objects.get(pk=pk)
            except Prescription.DoesNotExist:
                return Response({'detail': 'Prescription not found.'}, status=status.HTTP_404_NOT_FOUND)

            if prescription.doctor != user and prescription.patient != user:
                raise PermissionDenied("You don't have access to this prescription.")

            serializer = PrescriptionSerializer(prescription)
            return Response(serializer.data)

        # List prescriptions
        if user.role == 'doctor':
            prescriptions = Prescription.objects.filter(doctor=user)
        else:
            prescriptions = Prescription.objects.filter(patient=user, status='active')

        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        if user.role != 'doctor':
            raise ValidationError("Only doctors can create prescriptions.")

        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        if not pk:
            return Response({'detail': 'Prescription ID is required for update.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            prescription = Prescription.objects.get(pk=pk)
        except Prescription.DoesNotExist:
            return Response({'detail': 'Prescription not found.'}, status=status.HTTP_404_NOT_FOUND)

        if prescription.doctor != request.user:
            raise PermissionDenied("You can only update your own prescriptions.")

        serializer = PrescriptionSerializer(prescription, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


