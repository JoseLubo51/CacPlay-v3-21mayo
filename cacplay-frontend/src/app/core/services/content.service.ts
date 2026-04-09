import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private apiUrl = 'http://localhost:8000/api/contenidos/';

  constructor(private http: HttpClient) {}

  getContenido() {
    return this.http.get(this.apiUrl);
  }
}