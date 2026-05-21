from rest_framework import serializers
from .models import Contenido, Favorito # 👈 Agregamos Favorito aquí

class ContenidoSerializer(serializers.ModelSerializer):
    es_favorito = serializers.SerializerMethodField()
    # 👈 Declaramos estos campos como ReadOnly para que viajen en el JSON
    rating_promedio = serializers.ReadOnlyField()
    total_votos = serializers.ReadOnlyField()

    class Meta:
        model = Contenido
        # Al usar '__all__', Django incluirá los campos del modelo 
        # y sumará los que declaramos arriba (es_favorito, rating_promedio, total_votos)
        fields = '__all__' 

    def get_es_favorito(self, obj):
        request = self.context.get('request')
        
        if not request or not hasattr(request, 'user') or request.user.is_anonymous:
            return False
            
        return Favorito.objects.filter(user=request.user, contenido=obj).exists()