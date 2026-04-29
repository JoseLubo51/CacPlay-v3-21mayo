import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth'; // Importamos el servicio unificado

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isPublicRoute = route.data?.['public'];
  const hasValidToken = authService.isLoggedIn();

  // 1. Si la ruta es pública (como el login)
  if (isPublicRoute) {
    // Si ya está logueado y trata de ir al login, lo mandamos al inicio
    if (hasValidToken) {
      router.navigate(['/inicio']);
      return false;
    }
    return true;
  }

  // 2. Si es una ruta privada y TIENE token, lo dejamos pasar
  if (hasValidToken) {
    return true; 
  }

  // 3. Si no tiene token y es ruta privada, limpieza y al login
  authService.logout(); 
  router.navigate(['/login']);
  return false;
};