import { Component, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home';
import { RouterModule, Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  hero: any = null;
  novedades: any[] = [];
  eventos: any[] = [];
  podcasts: any[] = [];
  miLista: any[] = [];

  constructor(
    private homeService: HomeService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarContenido();
  }

  cargarContenido() {
    this.homeService.getHomeContent().subscribe({
      next: (data: any) => {
        this.hero = data.hero;
        this.novedades = data.novedades || [];
        this.eventos = data.eventos || [];
        this.podcasts = data.podcasts || [];
        
        // El HomeService ahora tiene getMiLista, podemos llamarlo por separado 
        // o esperar que el endpoint 'home' lo incluya.
        this.homeService.getMiLista().subscribe(favs => this.miLista = favs);

        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al obtener contenido:', err)
    });
  }

  // 💖 AGREGAR/QUITAR DE FAVORITOS (Para el Hero)
  toggleFavorito(item: any) {
  if (!item) return;
  
  this.homeService.toggleFavorito(item.id).subscribe({
    next: (res: any) => {
      item.es_favorito = res.favorito;
      
      // ✨ Esto hace que la fila de "Mi Lista" se actualice al instante
      this.homeService.getMiLista().subscribe(favs => {
        this.miLista = favs;
        this.cdr.detectChanges();
      });
    }
  });
}

  // ⭐ CALIFICAR (Para actualizar votos en tiempo real)
  calificar(item: any, puntuacion: number) {
    this.homeService.enviarCalificacion(item.id, puntuacion).subscribe({
      next: (res: any) => {
        // IMPORTANTE: Aquí vinculamos la respuesta de Django con tu objeto Hero
        item.rating_promedio = res.rating_promedio;
        item.total_votos = res.total_votos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al calificar:', err)
    });
  }

  goToContent(item: any) {
    this.router.navigate(['/contenido', item.id]);
  }
}

