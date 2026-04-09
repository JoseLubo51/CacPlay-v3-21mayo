import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Añadimos ChangeDetectorRef
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
    private cdr: ChangeDetectorRef // 👈 Inyectamos el detector de cambios
  ) {}

  ngOnInit(): void {}

  goToContent(item: any) {
    this.router.navigate(['/contenido', item.id]);
  }

  toggleFavorito(event: Event, item: any) {
    // 1. Detenemos la propagación para que no se ejecute goToContent()
    event.preventDefault();
    event.stopPropagation();
    
    if (!item || !item.id) return;

    this.homeService.toggleFavorito(item.id).subscribe({
      next: (res: any) => {
        // 2. Actualizamos el valor que viene de Django
        item.es_favorito = res.favorito;
        
        // 3. 🚩 ¡CLAVE!: Forzamos a Angular a revisar la vista y pintar el botón
        this.cdr.detectChanges();
        
        console.log('Estado favorito:', item.es_favorito, res.mensaje);
      },
      error: (err) => {
        console.error('Error al marcar favorito:', err);
      }
    });
  }
}