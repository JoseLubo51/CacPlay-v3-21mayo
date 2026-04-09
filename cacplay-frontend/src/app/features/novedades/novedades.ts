import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home';
import { ContenidoGrilla } from '../contenido-grilla/contenido-grilla'; 
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule, ContenidoGrilla],
  template: `
    <app-contenido-grilla 
      titulo="Novedades" 
      [contenidos]="lista">
    </app-contenido-grilla>
  `
})
export class Novedades implements OnInit {
  lista: any[] = [];

  constructor(private homeService: HomeService, private cdr: ChangeDetectorRef) {}

 ngOnInit() {
  this.homeService.getHomeContent().subscribe({
    next: (data: any) => {
      this.lista = data.novedades || [];
      console.log('Lista asignada:', this.lista.length);
      
      // 🔥 ESTO ES CLAVE: Le dice a Angular "¡Hey, los datos cambiaron, dibuja de nuevo!"
      this.cdr.detectChanges(); 
    }
  });
}
}