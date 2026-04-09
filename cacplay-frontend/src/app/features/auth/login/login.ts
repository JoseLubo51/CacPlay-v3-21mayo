import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    console.log('FORM VALUE:', this.loginForm.value);

    this.authService.login(email!, password!).subscribe({
  next: (response) => {
    

    localStorage.setItem('access', response.access);
    localStorage.setItem('refresh', response.refresh);

    this.authService.getPerfil().subscribe({
      next: (perfil) => {
        console.log('Perfil:', perfil);

        // 👇 navega aquí (más limpio)
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error perfil:', err);
        this.router.navigate(['/inicio']); // fallback
      }
    });

    this.loading = false;
  },

  error: (error) => {
    console.error('Error login:', error);
    this.errorMessage = 'Credenciales incorrectas';
    this.loading = false;
  }
});
}

}
