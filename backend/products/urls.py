from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FrameTypeViewSet,CategoryView, ProductViewSet,AccessoryViewSet

router = DefaultRouter()
router.register(r'frame-types', FrameTypeViewSet, basename='frame-type')
router.register(r'categories', CategoryView, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'accessories', AccessoryViewSet, basename='accessory')

urlpatterns = [
    path('', include(router.urls)),
]
