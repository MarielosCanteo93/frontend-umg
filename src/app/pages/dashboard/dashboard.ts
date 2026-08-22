import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // =========================================================
  // ESTADÍSTICAS DEL DASHBOARD
  // =========================================================

  totalUsers = 0;

  totalLaboratories = 0;

  totalReservations = 0;

  availableLaboratories = 0;


  // =========================================================
  // ESTADO
  // =========================================================

  loading = true;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly api: ApiService
  ) {}


  // =========================================================
  // INICIO
  // =========================================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // =========================================================
  // CARGAR DASHBOARD
  // =========================================================

  loadDashboard(): void {

    this.loading = true;


    // =======================================================
    // USUARIOS
    // =======================================================

    this.api.getUsers().subscribe({

      next: (response) => {

        console.log(
          '👥 RESPUESTA USUARIOS:',
          response
        );


        const users =
          this.extractArray(response);


        this.totalUsers =
          users.length;


        console.log(
          '👥 Total usuarios:',
          this.totalUsers
        );

      },

      error: (error) => {

        console.error(
          '❌ Error cargando usuarios:',
          error
        );

        this.totalUsers = 0;

      }

    });


    // =======================================================
    // LABORATORIOS
    // =======================================================

    this.api.getLaboratories().subscribe({

      next: (response) => {

        console.log(
          '📦 RESPUESTA LABORATORIOS:',
          response
        );


        const laboratories =
          this.extractArray(response);


        this.totalLaboratories =
          laboratories.length;


        console.log(
          '🧪 Total laboratorios:',
          this.totalLaboratories
        );


        // ---------------------------------------------------
        // DISPONIBILIDAD
        // ---------------------------------------------------

        this.availableLaboratories =
          this.calculateAvailableLaboratories(
            laboratories
          );


        console.log(
          '🟢 Laboratorios disponibles:',
          this.availableLaboratories
        );

      },

      error: (error) => {

        console.error(
          '❌ Error cargando laboratorios:',
          error
        );

        this.totalLaboratories = 0;

        this.availableLaboratories = 0;

      }

    });


    // =======================================================
    // RESERVACIONES
    // =======================================================

    this.api.getReservations().subscribe({

      next: (response) => {

        console.log(
          '📅 RESPUESTA RESERVACIONES:',
          response
        );


        const reservations =
          this.extractArray(response);


        this.totalReservations =
          reservations.length;


        console.log(
          '📅 Total reservas:',
          this.totalReservations
        );


        this.loading = false;

      },

      error: (error) => {

        console.error(
          '❌ Error cargando reservaciones:',
          error
        );

        this.totalReservations = 0;

        this.loading = false;

      }

    });

  }


  // =========================================================
  // CALCULAR LABORATORIOS DISPONIBLES
  // =========================================================

  private calculateAvailableLaboratories(
    laboratories: any[]
  ): number {

    return laboratories.filter(
      (lab: any) => {

        const estado =
          String(
            lab?.UMG_Estado ?? ''
          )
            .trim()
            .toLowerCase();


        return (

          lab?.UMG_Estado === 1 ||

          lab?.UMG_Estado === true ||

          estado === '1' ||

          estado === 'activo' ||

          estado === 'activa' ||

          estado === 'disponible' ||

          estado === 'disponible'

        );

      }
    ).length;

  }


  // =========================================================
  // EXTRAER ARRAY DE LA RESPUESTA
  // =========================================================

  private extractArray(
    response: any
  ): any[] {

    // -------------------------------------------------------
    // RESPUESTA DIRECTA
    //
    // [
    //   {...},
    //   {...}
    // ]
    // -------------------------------------------------------

    if (
      Array.isArray(response)
    ) {

      return response;

    }


    // -------------------------------------------------------
    // RESPUESTA PAGINADA
    //
    // {
    //   count: 28,
    //   results: [...]
    // }
    // -------------------------------------------------------

    if (
      response &&
      Array.isArray(response.results)
    ) {

      return response.results;

    }


    // -------------------------------------------------------
    // RESPUESTA CON DATA
    //
    // {
    //   data: [...]
    // }
    // -------------------------------------------------------

    if (
      response &&
      Array.isArray(response.data)
    ) {

      return response.data;

    }


    console.warn(
      '⚠️ La respuesta de la API no contiene un arreglo:',
      response
    );


    return [];

  }

}