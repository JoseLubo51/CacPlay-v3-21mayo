from django.contrib import admin
from .models import Contenido
from .models import Contenido, Calificacion

admin.site.register(Contenido)
admin.site.register(Calificacion)