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

  // No interceptar endpoints de autenticación JWT
  if (
    req.url.includes('/token/') ||
    req.url.includes('/token/refresh/')
  ) {
    return next(req);
  }

  // Si no hay token, enviar normal
  if (!token || token === 'undefined' || token === 'null') {
    return next(req);
  }

  // Clonar request con Bearer Token (JWT)
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token.trim()}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('⛔ Sesión inválida o expirada');
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};