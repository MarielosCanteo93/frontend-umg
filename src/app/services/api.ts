import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = 'https://umg-api-django.onrender.com/api';
  

  constructor(private readonly http: HttpClient) {}

  // =========================================================
  // AUTENTICACIÓN
  // =========================================================

  login(
    username: string,
    password: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/login/`,
      {
        UMG_Usuario: username,
        UMG_Contrasena: password
      }
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/cambiar-contrasena/`,
      {
        UMG_Contrasena_Actual: currentPassword,
        UMG_Contrasena_Nueva: newPassword
      }
    );
  }

  // =========================================================
  // USUARIOS
  // =========================================================

  getUsers(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/usuarios/`
    );
  }

  createUser(user: any): Observable<any> {

    console.log('POST usuario:', user);

    return this.http.post(
      `${this.apiUrl}/usuarios/`,
      user
    );
  }

  updateUser(
    id: number,
    user: any
  ): Observable<any> {

    console.log(
      `PATCH usuario ${id}:`,
      user
    );

    return this.http.patch(
      `${this.apiUrl}/usuarios/${id}/`,
      user
    );
  }

  deleteUser(id: number): Observable<any> {

    console.log(
      `DELETE usuario ${id}`
    );

    return this.http.delete(
      `${this.apiUrl}/usuarios/${id}/`
    );
  }

  // =========================================================
  // LABORATORIOS
  // =========================================================

  getLaboratories(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/labs/`
    );
  }

  getAvailableLaboratories(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/labs/disponibles/`
    );
  }

  createLaboratory(
    laboratory: any
  ): Observable<any> {

    console.log(
      'POST laboratorio:',
      laboratory
    );

    return this.http.post(
      `${this.apiUrl}/labs/`,
      laboratory
    );
  }

  updateLaboratory(
    id: number,
    laboratory: any
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}/labs/${id}/`,
      laboratory
    );
  }

  deleteLaboratory(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/labs/${id}/`
    );
  }

  // =========================================================
  // CONDICIONES / BLOQUEOS
  // =========================================================

  getConditions(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/condiciones/`
    );
  }

  // =========================================================
  // RESERVAS
  // =========================================================

  getReservations(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/reservas/`
    );
  }

  createReservation(
    reservation: any
  ): Observable<any> {

    console.log(
      'POST reserva:',
      reservation
    );

    return this.http.post(
      `${this.apiUrl}/reservas/`,
      reservation
    );
  }

  updateReservation(
    id: number,
    reservation: any
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}/reservas/${id}/`,
      reservation
    );
  }

  cancelReservation(
    id: number
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}/reservas/${id}/`,
      {
        UMG_Estado: 'Cancelada'
      }
    );
  }

  // =========================================================
  // LOGS
  // =========================================================

  getLogs(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/logs/`
    );
  }
}