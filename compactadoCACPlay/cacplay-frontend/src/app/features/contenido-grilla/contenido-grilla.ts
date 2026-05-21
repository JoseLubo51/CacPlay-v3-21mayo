import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home';

@Component({
  selector: 'app-contenido-grilla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contenido-grilla.html',
  styleUrl: './contenido-grilla.css'
})
export class ContenidoGrilla implements OnInit {
  
  @Input() titulo: string = '';
  @Input() contenidos: any[] = [];

  constructor(
    private router: Router, 
    private homeService: HomeService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {}

  goToContent(item: any) {
    if (item && item.id) {
      this.router.navigate(['/contenido', item.id]);
    }
  }

  toggleFavorito(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    
    // Log de control para ver qué estamos intentando marcar
    console.log('Intentando toggleFavorito desde GRILLA para item:', item);

    if (!item || !item.id) {
        console.error('❌ Error en Grilla: El item no tiene ID o es nulo');
        return;
    }

    this.homeService.toggleFavorito(item.id).subscribe({
      next: (res: any) => {
        // Usamos la respuesta del servidor o invertimos el estado actual
        item.es_favorito = res.favorito !== undefined ? res.favorito : !item.es_favorito;
        
        this.cdr.detectChanges();
        
        // Un mensaje más discreto (puedes quitar el alert después de probar)
        console.log('✅ Estado actualizado en Grilla:', item.es_favorito);
        alert(item.es_favorito ? 'Agregado a Mi Lista' : 'Removido de Mi Lista');
      },
      error: (err: any) => {
        console.error('🔴 Error real en Grilla:', err);
        console.log('Status del error:', err.status); // Esto nos dirá si es 401, 403, 500, etc.
        alert('No fue posible actualizar Mi Lista');
      }
    });
}
}