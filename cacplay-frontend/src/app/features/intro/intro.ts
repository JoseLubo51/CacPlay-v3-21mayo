import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.html'
})
export class Intro implements OnInit, AfterViewInit {
  
  videoActivo: boolean = true;

  // Capturamos el elemento #videoSplash del HTML
  @ViewChild('videoSplash') videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Se ejecuta automáticamente cuando Angular termina de renderizar el DOM
  ngAfterViewInit(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      // Forzamos la reproducción inmediata controlando la promesa del navegador
      this.videoElement.nativeElement.play().catch(error => {
        console.log("El navegador bloqueó el autoplay, esperando interacción:", error);
      });
    }
  }

  onVideoTerminado(): void {
    this.videoActivo = false;
  }

  // 1. Redirección a la URL externa de inicio de sesión de CAC
  onLoginSso() {
    window.location.href = 'https://cuentadealtocosto.org/iniciar-sesion/'; 
  }

  // 2. Redirección al login interno de CACPlay para superadministradores
  onAdminLogin() {
    this.router.navigate(['/login']);
  }
}