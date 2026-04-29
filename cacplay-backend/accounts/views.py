from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import EmailTokenObtainSerializer

# 1. ESTA ES LA QUE TE FALTABA (Login)
class LoginView(APIView):
    permission_classes = [] # El login debe ser público

    def post(self, request):
        serializer = EmailTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            # Devuelve el access y refresh token
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. ESTA ES LA DE PERFIL
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