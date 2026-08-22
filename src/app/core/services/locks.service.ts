import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Lock } from '../../models/lock.model';

@Injectable({
  providedIn: 'root'
})
export class LocksService {

  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lock[]> {
    return this.http.get<Lock[]>(
      `${this.apiUrl}/condiciones/`
    );
  }

}