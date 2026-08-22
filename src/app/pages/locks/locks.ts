import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api';

interface Condition {
  UMG_ID: number;
  UMG_Lab_ID: number;
  UMG_Lab_Nombre: string;
  UMG_Fecha: string;
  UMG_Hora_Inicio: string;
  UMG_Hora_Fin: string;
  UMG_Tipo: string;
  UMG_Motivo: string;
  UMG_Estado: number;
  UMG_Fecha_Registro: string;
}

@Component({
  selector: 'app-locks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './locks.html',
  styleUrl: './locks.css'
})
export class Locks implements OnInit {

  // =========================
  // DATOS
  // =========================

  conditions: Condition[] = [];

  filteredConditions: Condition[] = [];

  searchTerm = '';

  loading = false;

  errorMessage = '';


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private readonly api: ApiService
  ) {}


  // =========================
  // INICIO
  // =========================

  ngOnInit(): void {

    this.loadConditions();

  }


  // =========================
  // CARGAR BLOQUEOS
  // =========================

  loadConditions(): void {

    this.loading = true;

    this.errorMessage = '';

    this.api.getConditions().subscribe({

      next: (response) => {

        console.log(
          'Condiciones recibidas:',
          response
        );

        if (Array.isArray(response)) {

          this.conditions = response;

        } else if (response?.results) {

          this.conditions = response.results;

        } else {

          this.conditions = [];

        }

        this.applyFilter();

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Error cargando condiciones:',
          error
        );

        this.conditions = [];

        this.filteredConditions = [];

        this.errorMessage =
          'No fue posible cargar los bloqueos.';

        this.loading = false;

      }

    });

  }


  // =========================
  // BÚSQUEDA
  // =========================

  searchConditions(): void {

    this.applyFilter();

  }


  private applyFilter(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (!term) {

      this.filteredConditions =
        [...this.conditions];

      return;

    }

    this.filteredConditions =
      this.conditions.filter(
        (condition: Condition) => {

          const laboratory =
            condition.UMG_Lab_Nombre
              ?.toLowerCase() ?? '';

          const type =
            condition.UMG_Tipo
              ?.toLowerCase() ?? '';

          const reason =
            condition.UMG_Motivo
              ?.toLowerCase() ?? '';

          return (
            laboratory.includes(term) ||
            type.includes(term) ||
            reason.includes(term)
          );

        }
      );

  }


  // =========================
  // ESTADO
  // =========================

  getStatusText(
    status: number
  ): string {

    return status === 1
      ? 'Activo'
      : 'Inactivo';

  }


  // =========================
  // TRACKING
  // =========================

  trackByConditionId(
    index: number,
    condition: Condition
  ): number {

    return condition.UMG_ID;

  }

}