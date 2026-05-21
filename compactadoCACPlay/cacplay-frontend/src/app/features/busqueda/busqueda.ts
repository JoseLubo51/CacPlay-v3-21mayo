import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home'; // Verifica que la ruta sea correcta
import { ContenidoGrilla } from '../contenido-grilla/contenido-grilla'; 

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, ContenidoGrilla],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda implements OnInit {
  
  resultados: any[] = [];
  terminoBusqueda: string = '';
  cargando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Escuchamos cambios en los parámetros de la URL (?q=...)
    this.route.queryParams.subscribe(params => {
      this.terminoBusqueda = params['q'] || '';
      if (this.terminoBusqueda) {
        this.ejecutarBusqueda();
      }
    });
  }

  ejecutarBusqueda() {
    this.cargando = true;
    this.homeService.getBusqueda(this.terminoBusqueda).subscribe({
      next: (data: any) => {
        // IMPORTANTE: Si Django devuelve un objeto con 'results', usamos data.results
        // Si devuelve la lista pura, usamos data.
        this.resultados = Array.isArray(data) ? data : (data.results || []);
        
        console.log('Resultados encontrados:', this.resultados); // 👈 Revisa esto en F12
        
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error en la búsqueda de Django:', err);
        this.cargando = false;
      }
    });
  }
}