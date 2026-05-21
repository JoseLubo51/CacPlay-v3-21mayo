import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../services/home'; 
import { ContenidoGrilla } from '../../contenido-grilla/contenido-grilla';

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
        // 1. Tomamos la base de datos
        const basePodcasts = data.podcasts || [];

        // 2. Filtramos por el campo técnico 'seccion'
        this.episodios = basePodcasts.filter((item: any) => 
          item.seccion === 'cac_contigo'
        );

        // Debug para confirmar
        console.log('Filtro por sección exitoso. Cantidad:', this.episodios.length);

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar episodios:', err);
        this.cargando = false;
      }
    });
  }
}