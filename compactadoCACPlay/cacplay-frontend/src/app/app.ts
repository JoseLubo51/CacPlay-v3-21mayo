import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'cacplay-frontend';

  constructor() {}

  ngOnInit() {
    // Aquí la app arranca limpia. 
    // No busca tokens en la URL ni escucha mensajes del iFrame.
    console.log('🚀 CACPlay inicializada en modo estándar.');
  }

  // Se eliminaron HostListener y procesarLoginSSO para evitar conflictos de sesión
}