import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Laboratory } from '../../models/laboratory.model';

@Injectable({
  providedIn: 'root'
})
export class LaboratoriesService {

  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Laboratory[]> {
    return this.http.get<Laboratory[]>(
      `${this.apiUrl}/labs/`
    );
  }

  getAvailable(): Observable<Laboratory[]> {
    return this.http.get<Laboratory[]>(
      `${this.apiUrl}/labs/disponibles/`
    );
  }

}