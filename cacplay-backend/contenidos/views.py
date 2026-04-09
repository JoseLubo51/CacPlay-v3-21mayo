from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Contenido, Calificacion, Favorito # Importaciones consolidadas
from .serializers import ContenidoSerializer
from django.db.models import Q

class ContenidoViewSet(viewsets.ModelViewSet):
    queryset = Contenido.objects.all()
    serializer_class = ContenidoSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'proveedor']
    ordering_fields = ['fecha_publicacion', 'creado']

    # --- 1. ENDPOINT PARA HOME (REINSTALADO) ---
    @action(detail=False, methods=['get'])
    def home(self, request):
        hero = Contenido.objects.filter(tipo='video', activo=True).order_by('-creado').first()
        novedades = Contenido.objects.filter(activo=True).order_by('-creado')[:12]
        eventos = Contenido.objects.filter(categoria='eventos', activo=True).order_by('-creado')[:12]
        podcasts = Contenido.objects.filter(tipo='podcast', activo=True).order_by('?')[:12]

        # 🚩 Agregamos context={'request': request} a todos para que se vea el botón de favoritos
        data = {
            "hero": ContenidoSerializer(hero, context={'request': request}).data if hero else None,
            "novedades": ContenidoSerializer(novedades, many=True, context={'request': request}).data,
            "eventos": ContenidoSerializer(eventos, many=True, context={'request': request}).data,
            "podcasts": ContenidoSerializer(podcasts, many=True, context={'request': request}).data,
        }
        return Response(data)

    # --- 2. RECUPERAR UN CONTENIDO (DETALLE) ---
    def retrieve(self, request, *args, **kwargs):
        contenido = self.get_object()
        relacionados = Contenido.objects.filter(
            tipo=contenido.tipo, activo=True
        ).exclude(id=contenido.id).order_by('-creado')[:6]

        data = {
            "contenido": ContenidoSerializer(contenido, context={'request': request}).data,
            "relacionados": ContenidoSerializer(relacionados, many=True, context={'request': request}).data
        }
        return Response(data)

    # --- 3. ENDPOINT PARA CALIFICAR ---
    @action(detail=True, methods=['post'])
    def calificar(self, request, pk=None):
        contenido = self.get_object()
        puntuacion = request.data.get('puntuacion')

        try:
            puntuacion = int(puntuacion)
            if not (1 <= puntuacion <= 5): raise ValueError()
        except (ValueError, TypeError):
            return Response({"error": "Puntuación inválida"}, status=400)

        Calificacion.objects.create(contenido=contenido, puntuacion=puntuacion)

        return Response({
            "mensaje": "Calificación guardada",
            "rating_promedio": contenido.rating_promedio,
            "total_votos": contenido.total_votos
        }, status=status.HTTP_201_CREATED)

    # --- 4. ENDPOINT PARA MI LISTA ---
    @action(detail=False, methods=['get'], url_path='mi-lista')
    def mi_lista(self, request):
        if not request.user.is_authenticated:
            return Response([], status=status.HTTP_200_OK)

        favoritos_ids = Favorito.objects.filter(user=request.user).values_list('contenido_id', flat=True)
        contenidos = Contenido.objects.filter(id__in=favoritos_ids, activo=True)
        
        serializer = ContenidoSerializer(contenidos, many=True, context={'request': request})
        return Response(serializer.data)

    # --- 5. ENDPOINT PARA AGREGAR/QUITAR DE MI LISTA ---
    @action(detail=True, methods=['post'], url_path='toggle-favorito')
    def toggle_favorito(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({"error": "No autorizado"}, status=401)

        contenido = self.get_object()
        user = request.user
        favorito_existente = Favorito.objects.filter(user=user, contenido=contenido).first()

        if favorito_existente:
            favorito_existente.delete()
            return Response({"favorito": False, "mensaje": "Quitado"}, status=200)
        else:
            Favorito.objects.create(user=user, contenido=contenido)
            return Response({"favorito": True, "mensaje": "Agregado"}, status=201)