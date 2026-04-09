from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):


    email = models.EmailField(unique=True)

    ROLES = (
        ('superadmin', 'Super Administrador'),
        ('vip', 'Usuario VIP'),
        ('registrado', 'Usuario Registrado'),
    )

    rol = models.CharField(
        max_length=20,
        choices=ROLES,
        default='registrado'
    )

    telefono = models.CharField(max_length=20)
    entidad = models.CharField(max_length=255)


    def save(self, *args, **kwargs):
        if self.email:
            if self.email.endswith('@cuentadealtocosto.org') or self.email.endswith('@elevates.com.co'):
                self.rol = 'vip'
            elif not self.is_superuser:
                self.rol = 'registrado'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
