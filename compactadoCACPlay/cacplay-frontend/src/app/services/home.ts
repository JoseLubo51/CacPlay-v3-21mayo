import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = `${environment.apiUrl}/contenidos`;

  constructor(private http: HttpClient) {}

  getBusqueda(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/?search=${query}`);
  }
  
  getHomeContent(): Observable<any> {
    return this.http.get(`${this.baseUrl}/home/`);
  }

  getContenidoById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/`);
  }

  enviarCalificacion(id: number, puntuacion: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/calificar/`, { puntuacion });
  }

  toggleFavorito(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/toggle-favorito/`, {});
  }

  getMiLista(): Observable<any> {
    return this.http.get(`${this.baseUrl}/mi-lista/`);
  }
}