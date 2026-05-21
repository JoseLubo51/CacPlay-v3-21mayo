import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth'; 

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const hasValidToken = authService.isLoggedIn();

  // 1. Permitir siempre el paso al sso-callback sin restricciones del guard
  // (Esto evita bucles de redirección mientras se procesa el login de WP)
  if (state.url.includes('/sso-callback')) {
    return true;
  }

  // 2. Si ya tiene un token válido y el usuario intenta entrar a la intro o al login
  if (hasValidToken && (state.url === '/intro' || state.url === '/login')) {
    router.navigate(['/inicio']);
    return false;
  }

  // 3. Si es una ruta privada y TIENE token, lo dejamos pasar
  if (hasValidToken) {
    return true; 
  }

  // 4. Si no tiene token (usuario anónimo):
  if (state.url === '/intro' || state.url === '/login') {
    return true;
  }

  // 5. Redirección por defecto a la INTRO
  router.navigate(['/intro']);
  return false;
};