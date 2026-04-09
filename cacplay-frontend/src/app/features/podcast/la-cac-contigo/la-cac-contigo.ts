import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../services/home'; 
import { ContenidoGrilla } from '../../contenido-grilla/contenido-grilla'; // Ajusta la ruta a tu grilla compartida

@Component({
  selector: 'app-la-cac-contigo',
  standalone: true,
  imports: [CommonModule, ContenidoGrilla],
  templateUrl: './la-cac-contigo.html',
  styleUrl: './la-cac-contigo.css'
})
export class LaCacContigo implements OnInit {
  
  episodios: any[] = [];
  cargando: boolean = true;

  constructor(
    private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.homeService.getHomeContent().subscribe({
      next: (data: any) => {
        // Filtramos de la sección de podcasts del home
        const todosLosPodcasts = data.podcasts || [];
        
        // Filtramos por el nombre del programa
        this.episodios = todosLosPodcasts.filter((item: any) => 
          item.categoria === 'La CAC contigo' || item.proveedor === 'La CAC contigo'
        );
        console.log(data);


        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar episodios:', err);
        this.cargando = false;
      }
    });
  }
}