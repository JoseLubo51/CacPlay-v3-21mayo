from django.urls import path
from .views import PerfilView, LoginView, WordPressSSOView # 👈 Importamos la nueva vista

urlpatterns = [
    path('perfil/', PerfilView.as_view(), name='perfil'),
    path('login/', LoginView.as_view(), name='login'),
    
    # 🌐 Ruta para el intercambio de Token SSO de WordPress
    path('auth/wordpress-sso/', WordPressSSOView.as_view(), name='wordpress-sso'),
]