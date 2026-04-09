from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView # 👈 Importante para el salto automático
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # 🏠 REDIRECCIÓN DE LA RAÍZ AL ADMIN
    path('', RedirectView.as_view(url='/admin/', permanent=True)), 

    path('admin/', admin.site.urls),
    
    # 🔌 TUS APIS
    path('api/', include('contenidos.urls')),
    path('api/', include('accounts.urls')),
    
    # 🔑 TOKENS JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
