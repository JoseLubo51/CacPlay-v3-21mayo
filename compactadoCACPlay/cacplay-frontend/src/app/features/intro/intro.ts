import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.html'
})
export class Intro {

  constructor(private router: Router) { }

  // 1. Redirección a la URL externa de inicio de sesión de CAC
  onLoginSso() {
    window.location.href = 'https://cuentadealtocosto.org/iniciar-sesion/'; 
   
  }

  // 2. Redirección al login interno de CACPlay para superadministradores
  onAdminLogin() {
    this.router.navigate(['/login']);
  }
}