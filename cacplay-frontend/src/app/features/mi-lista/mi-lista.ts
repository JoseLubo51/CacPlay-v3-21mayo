import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home'; // Ajusta según tu estructura real
import { ContenidoGrilla } from '../contenido-grilla/contenido-grilla';

@Component({
  selector: 'app-mi-lista',
  standalone: true,
  imports: [CommonModule, ContenidoGrilla],
  template: `
    <div class="container-fluid py-4">
      <h2 class="text-white mb-4">Mi Lista</h2>
      
      <div *ngIf="cargando" class="text-center text-white">
        <p>Cargando tus favoritos...</p>
      </div>

      <div *ngIf="!cargando && contenidos.length === 0" class="text-center text-white py-5">
        <h4>Aún no tienes contenidos en tu lista.</h4>
        <p>Agrega películas o podcasts para verlos aquí.</p>
      </div>

      <div *ngIf="!cargando && contenidos.length > 0">
        <app-contenido-grilla [contenidos]="contenidos"></app-contenido-grilla>
      </div>
    </div>
  `,
  styles: [`
    h2 { font-weight: bold; margin-left: 20px; }
  `]
})
export class MiLista implements OnInit {
  contenidos: any[] = [];
  cargando: boolean = true;

  constructor(
    private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.homeService.getMiLista().subscribe({
      next: (data: any) => {
        // Django suele devolver el array directamente o dentro de una propiedad
        this.contenidos = Array.isArray(data) ? data : (data.resultados || []);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar Mi Lista:', err);
        this.cargando = false;
      }
    });
  }
}