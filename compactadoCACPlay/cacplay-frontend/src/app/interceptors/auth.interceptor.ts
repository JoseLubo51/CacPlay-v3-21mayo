import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../core/services/auth';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 1. Añadimos el endpoint de SSO a la lista de exclusión
  // No queremos enviar un token (que podría ser basura) cuando apenas vamos a validarnos
  if (
    req.url.includes('/token/') ||
    req.url.includes('/token/refresh/') ||
    req.url.includes('/auth/wordpress-sso/')
  ) {
    return next(req);
  }

  // 2. Validación robusta del token
  // Ahora también chequeamos si el token contiene rastro de PHP por error de WordPress
  if (!token || token === 'undefined' || token === 'null' || token.includes('<?php')) {
    return next(req);
  }

  // 3. Clonar request con Bearer Token (JWT)
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token.trim()}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 4. Solo hacemos logout automático si no estamos ya en la intro
      // Esto evita bucles de redirección infinitos
      if (error.status === 401) {
        console.error('⛔ Sesión inválida o expirada');
        authService.logout();
        // Opcional: podrías disparar una redirección manual aquí si fuera necesario
      }

      return throwError(() => error);
    })
  );
};