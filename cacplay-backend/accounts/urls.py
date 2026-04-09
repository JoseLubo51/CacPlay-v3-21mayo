from django.urls import path
from .views import PerfilView
from .views import LoginView

urlpatterns = [
    path('perfil/', PerfilView.as_view(), name='perfil'),
    path('login/', LoginView.as_view(), name='login'),
]
