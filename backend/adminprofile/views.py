from rest_framework import generics
from core.permission import IsAdmin  
from .models import AdminProfile
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import AdminProfileSerializer

class AdminProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        user = self.request.user
        profile, created = AdminProfile.objects.get_or_create(user=user)
        return profile

    def perform_update(self, serializer):
        profile_image = self.request.FILES.get('image')
        if profile_image:
            serializer.validated_data['image'] = profile_image
        serializer.save()
