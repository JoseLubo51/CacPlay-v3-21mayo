import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface LoginResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getPerfil() {
  return this.http.get('http://localhost:8000/api/perfil/');
}

  private apiUrl = 'http://localhost:8000/api/login/'; // ajustamos si cambia

  constructor(private http: HttpClient) {}

login(email: string, password: string): Observable<LoginResponse> {
  console.log('ENVIANDO AL BACK:', { email, password });

  return this.http.post<LoginResponse>(this.apiUrl, {
    email,
    password
  });
}
}
