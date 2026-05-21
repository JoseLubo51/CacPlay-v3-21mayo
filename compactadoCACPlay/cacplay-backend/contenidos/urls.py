from rest_framework.routers import DefaultRouter
from .views import ContenidoViewSet

router = DefaultRouter()
router.register(r'contenidos', ContenidoViewSet)

urlpatterns = router.urls
