from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EmailTokenObtainSerializer
from .models import Usuario
import requests

class LoginView(APIView):
    permission_classes = [] 

    def post(self, request):
        serializer = EmailTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WordPressSSOView(APIView):
    permission_classes = [] 

    def post(self, request):
        code = request.data.get('code')
        
        if not code or "<?php" in code:
            return Response({"error": "Código SSO no válido"}, status=status.HTTP_400_BAD_REQUEST)

        wp_url = "https://cuentadealtocosto.org/wp-json/cac-sso/v1/verify"
        
        try:
            # --- MOCK CONTROLADO (Simulando la respuesta de WP) ---
            if code == "DEBUG_MODE_ON":
                user_data = {
                    "success": True, 
                    "email": "usuario.test@cuentadealtocosto.org",
                    "first_name": "Usuario",
                    "last_name": "SSO",
                    "rol_wp": "vip"  # <--- WordPress nos dice el rol directamente
                }
            else:
                # 1. Validación REAL contra WordPress
                # wp_response = requests.post(wp_url, json={"code": code}, timeout=10)
                # user_data = wp_response.json()
                return Response({"error": "Modo real pendiente de activación"}, status=status.HTTP_401_UNAUTHORIZED)

            if not user_data.get('success'):
                return Response({"error": "Sesión de WordPress inválida"}, status=status.HTTP_401_UNAUTHORIZED)

            # 2. Sincronización Automática: Buscar o crear/actualizar
            # Usamos update_or_create para que si el rol cambia en WP, se actualice en CAC Play
            user, created = Usuario.objects.update_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['email'],
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),
                    'rol': user_data.get('rol_wp', 'registrado') # Priorizamos lo que diga WP
                }
            )

            # 3. Generación de tokens para Angular
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": user.email,
                "rol": user.rol # Este rol ya viene validado de WP
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Error de sincronización: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PerfilView(APIView):
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "rol": user.rol,
            "telefono": user.telefono,
            "entidad": user.entidad
        })