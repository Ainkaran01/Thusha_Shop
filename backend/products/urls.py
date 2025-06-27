from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FrameTypeViewSet,CategoryViewSet, ProductViewSet,AccessoryViewSet, product_detail,product_reviews

router = DefaultRouter()
router.register(r'frame-types', FrameTypeViewSet, basename='frame-type')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'accessories', AccessoryViewSet, basename='accessory')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/', product_detail, name='product-detail'),
    path('<int:pk>/reviews/', product_reviews, name='product-reviews'),
]
