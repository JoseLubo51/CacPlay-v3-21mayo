import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  // 🔥 NUEVO: permitir rutas públicas
  if (route.data?.['public']) {
    return true;
  }

  const token = localStorage.getItem('access');

  if (token) {
    return true; // ✅ deja pasar
  }

  // ❌ no autenticado → lo manda al login
  router.navigate(['/login']);
  return false;
};

