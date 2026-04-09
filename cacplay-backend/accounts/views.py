from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import EmailTokenObtainSerializer



class LoginView(APIView):

    def post(self, request):
        serializer = EmailTokenObtainSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "rol": user.rol,
            "telefono": user.telefono,
            "entidad": user.entidad
        })
