import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Añadimos SafeResourceUrl
import { HomeService } from '../../services/home';
import { ChangeDetectorRef } from '@angular/core';

// IMPORTANTE: Aquí deberías importar tu componente de podcast si quieres usarlo como etiqueta
// import { PodcastPlayer } from '../podcast/components/podcast-player/podcast-player'; 

@Component({
  selector: 'app-contenido',
  standalone: true,
  imports: [CommonModule, RouterModule], // Si conviertes el player a standalone, impórtalo aquí
  templateUrl: './contenido.html',
  styleUrl: './contenido.css'
})
export class Contenido implements OnInit {

  contenido: any;
  embedUrl: SafeResourceUrl | null = null; // Cambiamos videoUrl por embedUrl (más genérico)
  tipoContenido: 'video' | 'audio' | null = null; // NUEVO: Para saber qué estamos viendo
  relacionados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    public sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      this.rating = 0;
      this.hoverRating = 0;

      this.homeService.getContenidoById(id).subscribe((data: any) => {
        this.contenido = data.contenido;
        this.relacionados = data.relacionados;

        // NUEVO: Lógica para decidir si es Video o Podcast
        this.procesarContenido(this.contenido.url_externa);

        this.cdr.detectChanges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // NUEVO: Esta función detecta qué plataforma es y limpia la URL
  procesarContenido(url: string) {
    if (!url) return;

    // CASO A: ES YOUTUBE
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      this.tipoContenido = 'video';
      const videoId = this.extractYoutubeId(url);
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}`
      );
    } 
    
    // CASO B: ES SPOTIFY
    else if (url.includes('spotify.com')) {
      this.tipoContenido = 'audio';
      
      let spotifyUrl = url;

      // Si la URL de la base de datos no trae el "/embed/", se lo ponemos.
      // Esto transforma '.../show/123' en '.../embed/show/123' o '.../episode/123' en '.../embed/episode/123'
      if (!spotifyUrl.includes('/embed/')) {
        // Buscamos la parte donde dice spotify.com/ y justo ahí insertamos "embed/"
        spotifyUrl = spotifyUrl.replace('spotify.com/', 'spotify.com/embed/');
      }

      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(spotifyUrl);
    }
  }

  extractYoutubeId(url: string) {
    if (!url) return null;
    // Esta expresión regular es más robusta para capturar IDs de YouTube en diferentes formatos
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // --- VARIABLES (Se quedan igual) ---
  rating: number = 0;
  hoverRating: number = 0;
  showConfetti: boolean = false;
  confettiArray: number[] = [];

  // --- MÉTODO ACTUALIZADO (Este es el que reemplazas) ---
  setRating(value: number) {
    this.rating = value;

    // 1. Llamamos al servicio enviando el ID del contenido y la puntuación
    this.homeService.enviarCalificacion(this.contenido.id, value).subscribe({
      next: (res: any) => {
        console.log("¡Calificación guardada!", res);
        
        // 2. Actualizamos los datos en pantalla con lo que nos devuelve Django
        // Esto asume que en el Serializer de Django expusiste estos campos
        this.contenido.rating_promedio = res.rating_promedio;
        this.contenido.total_votos = res.total_votos;

        // 3. Efecto visual de confeti si la nota es 5
        if (value === 5) {
          this.triggerConfetti();
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al calificar:", err);
      }
    });
  }

  // --- MÉTODOS VISUALES (Se quedan igual) ---
  setHover(value: number) { 
    this.hoverRating = value; 
  }

  clearHover() { 
    this.hoverRating = 0; 
  }

  triggerConfetti() {
    this.confettiArray = Array.from({ length: 80 }, () => Math.random() * 100);
    this.showConfetti = true;
    setTimeout(() => { this.showConfetti = false; }, 1500);
  }

  // --- NUEVO MÉTODO PARA FAVORITOS ---
  toggleFavorito() {
    // Validamos que el contenido esté cargado
    if (!this.contenido || !this.contenido.id) {
      console.warn("No se puede marcar como favorito: el contenido no ha cargado.");
      return;
    }

    this.homeService.toggleFavorito(this.contenido.id).subscribe({
      next: (res: any) => {
        // 1. Actualizamos el estado booleano que viene de Django
        this.contenido.es_favorito = res.favorito;
        
        // 2. Forzamos a Angular a que actualice el color del botón en el HTML
        this.cdr.detectChanges();
        
        console.log('Favorito actualizado:', res.mensaje);
      },
      error: (err) => {
        // Si sale error 401, es que el usuario no está logueado
        if (err.status === 401) {
          console.error("Debes iniciar sesión para guardar favoritos.");
        } else {
          console.error("Error al procesar favorito:", err);
        }
      }
    });
  }

}