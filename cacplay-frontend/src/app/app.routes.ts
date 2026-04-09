import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },

  // 🔒 TODAS LAS RUTAS PROTEGIDAS BAJO EL LAYOUT PRINCIPAL
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home)
      },
      
      // --- NUEVAS SECCIONES ---
      {
        path: 'novedades',
        loadComponent: () =>
          import('./features/novedades/novedades').then(m => m.Novedades) 
          // 💡 Nota: Si vas a usar el mismo componente Home con filtros, apunta a Home.
          // Si creaste componentes nuevos, cambia la ruta del import.
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/eventos/eventos').then(m => m.Eventos)
      },
      {
        path: 'mi-lista',
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home)
      },

      {
       path: 'buscar',
       loadComponent: () => import('./features/busqueda/busqueda').then(m => m.Busqueda)
      },
      // -----------------------

      {
        path: 'contenido/:id',
        loadComponent: () =>
          import('./features/contenido/contenido').then(m => m.Contenido)
      },

      // 🎧 PODCASTS (Ruta unificada)
      
      { 
        path: 'podcast/la-cac-contigo', 
        loadComponent: () => import('./features/podcast/la-cac-contigo/la-cac-contigo').then(m => m.LaCacContigo) 
      },

      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
    ]
  },

  // Manejo de rutas inexistentes (404) -> Redirige al inicio si está logueado, sino el guard lo mandará al login
  {
    path: '**',
    redirectTo: 'inicio'
  }
];