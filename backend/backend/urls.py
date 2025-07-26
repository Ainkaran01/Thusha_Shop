from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth & core user operations
     path('api/core/', include('core.urls')),

    # User roles
    # path('api/users/', include('users.urls')),
     path('api/doctors/', include('doctors.urls')),
#     path('api/manufacturers/', include('manufacturers.urls')),
#     path('api/delivery/', include('delivery.urls')),

#     # Functional modules
     path('api/appointments/', include('appointments.urls')),
     path('api/prescriptions/', include('prescriptions.urls')),
     path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
#    path('api/reviews/', include('reviews.urls')),
    path('api/', include('face_shape.urls')),  # fallback or shared
    path('api/contact/', include('face_shape.urls')),
    path('api/faceshape/', include('face_shape.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/adminprofile/', include('adminprofile.urls')),
    path('api/pointofsales/', include('pointofsales.urls')),
 ]

# For media files (uploaded photos, prescriptions, etc.)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
