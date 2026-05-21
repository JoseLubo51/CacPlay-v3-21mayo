import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home';
import { ContenidoGrilla } from '../contenido-grilla/contenido-grilla'; 

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, ContenidoGrilla],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class Eventos implements OnInit {
  
  listaEventos: any[] = [];
  cargando: boolean = true;

  constructor(
    private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.homeService.getHomeContent().subscribe({
      next: (data: any) => {
        // Extraemos solo el array de eventos que viene del backend
        this.listaEventos = data.eventos || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la lista de eventos:', err);
        this.cargando = false;
      }
    });
  }
}