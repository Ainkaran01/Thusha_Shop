from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import PointOfSaleSerializer


class PointOfSaleCreateView(APIView):
    permission_classes = [permissions.AllowAny]  # Adjust as needed

    def post(self, request):
        serializer = PointOfSaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Billing completed successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
