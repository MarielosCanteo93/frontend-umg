import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api';

interface Laboratory {

  UMG_ID: number;

  UMG_Nombre: string;

  UMG_Estado: number;

  UMG_Reserva: string;

  UMG_Fecha_Registro: string;
}

@Component({
  selector: 'app-laboratories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './laboratories.html',
  styleUrl: './laboratories.css'
})
export class Laboratories implements OnInit {

  // =========================================================
  // DATOS
  // =========================================================

  laboratories: Laboratory[] = [];

  filteredLaboratories: Laboratory[] = [];

  searchTerm = '';


  // =========================================================
  // ESTADOS
  // =========================================================

  loading = false;

  saving = false;

  deleting = false;

  errorMessage = '';

  successMessage = '';


  // =========================================================
  // MODAL
  // =========================================================

  showLaboratoryModal = false;

  editingLaboratoryId: number | null = null;


  // =========================================================
  // FORMULARIO
  // =========================================================

  newLaboratory = {

    UMG_Nombre: '',

    UMG_Estado: 1,

    UMG_Reserva: 'D'

  };


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly api: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INICIO
  // =========================================================

  ngOnInit(): void {

    console.log(
      '🚀 Página de laboratorios iniciada'
    );

    this.loadLaboratories();

  }


  // =========================================================
  // CARGAR LABORATORIOS
  // =========================================================

  loadLaboratories(): void {

    console.log(
      '📦 Iniciando carga de laboratorios...'
    );

    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';


    // ---------------------------------------------------------
    // Actualizamos la vista inmediatamente
    // ---------------------------------------------------------

    this.cdr.detectChanges();


    // ---------------------------------------------------------
    // CONSULTA API
    // ---------------------------------------------------------

    this.api.getLaboratories().subscribe({

      next: (response: any) => {

        console.log(
          '📦 RESPUESTA LABORATORIOS:',
          response
        );


        // -----------------------------------------------------
        // NORMALIZAR RESPUESTA
        // -----------------------------------------------------

        this.laboratories =
          this.normalizeResponse(response);


        console.log(
          '📦 LABORATORIOS NORMALIZADOS:',
          this.laboratories
        );


        console.log(
          '📦 TOTAL LABORATORIOS:',
          this.laboratories.length
        );


        // -----------------------------------------------------
        // APLICAR FILTRO
        // -----------------------------------------------------

        this.applyFilter();


        // -----------------------------------------------------
        // TERMINÓ LA CARGA
        // -----------------------------------------------------

        this.loading = false;


        console.log(
          '✅ loading =',
          this.loading
        );


        console.log(
          '✅ filteredLaboratories:',
          this.filteredLaboratories
        );


        // -----------------------------------------------------
        // FORZAR ACTUALIZACIÓN DE ANGULAR
        // -----------------------------------------------------

        this.cdr.detectChanges();


        // -----------------------------------------------------
        // SEGUNDA ACTUALIZACIÓN
        //
        // Esto ayuda en casos donde la respuesta HTTP
        // llega fuera del ciclo normal de detección.
        // -----------------------------------------------------

        setTimeout(() => {

          this.cdr.detectChanges();

        }, 0);

      },


      error: (error) => {

        console.error(
          '❌ ERROR CARGANDO LABORATORIOS:',
          error
        );


        console.error(
          '❌ RESPUESTA DEL SERVIDOR:',
          error?.error
        );


        // -----------------------------------------------------
        // LIMPIAR DATOS
        // -----------------------------------------------------

        this.laboratories = [];

        this.filteredLaboratories = [];


        // -----------------------------------------------------
        // MENSAJE
        // -----------------------------------------------------

        this.errorMessage =
          error?.error?.mensaje ||
          error?.error?.detail ||
          error?.error?.message ||
          'No fue posible cargar los laboratorios.';


        // -----------------------------------------------------
        // TERMINÓ LA CARGA
        // -----------------------------------------------------

        this.loading = false;


        // -----------------------------------------------------
        // ACTUALIZAR VISTA
        // -----------------------------------------------------

        this.cdr.detectChanges();


        setTimeout(() => {

          this.cdr.detectChanges();

        }, 0);

      }

    });

  }


  // =========================================================
  // NORMALIZAR RESPUESTA
  // =========================================================

  private normalizeResponse(
    response: any
  ): Laboratory[] {

    // ---------------------------------------------------------
    // API devuelve directamente:
    //
    // [
    //   {...},
    //   {...}
    // ]
    // ---------------------------------------------------------

    if (Array.isArray(response)) {

      return response;

    }


    // ---------------------------------------------------------
    // API devuelve:
    //
    // {
    //   results: [...]
    // }
    // ---------------------------------------------------------

    if (
      response &&
      Array.isArray(response.results)
    ) {

      return response.results;

    }


    // ---------------------------------------------------------
    // API devuelve:
    //
    // {
    //   data: [...]
    // }
    // ---------------------------------------------------------

    if (
      response &&
      Array.isArray(response.data)
    ) {

      return response.data;

    }


    // ---------------------------------------------------------
    // API devuelve:
    //
    // {
    //   count: 8,
    //   results: [...]
    // }
    //
    // Ya cubierto arriba.
    // ---------------------------------------------------------


    // ---------------------------------------------------------
    // API devuelve un solo objeto
    // ---------------------------------------------------------

    if (
      response &&
      typeof response === 'object'
    ) {

      // Evitamos convertir respuestas de error
      // u objetos desconocidos en laboratorios.

      if (
        response.UMG_ID !== undefined
      ) {

        return [response];

      }

    }


    // ---------------------------------------------------------
    // No encontramos datos
    // ---------------------------------------------------------

    console.warn(
      '⚠️ La respuesta no contiene laboratorios:',
      response
    );


    return [];

  }


  // =========================================================
  // BÚSQUEDA
  // =========================================================

  searchLaboratories(): void {

    console.log(
      '🔎 Buscando:',
      this.searchTerm
    );

    this.applyFilter();

  }


  // =========================================================
  // APLICAR FILTRO
  // =========================================================

  private applyFilter(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    // ---------------------------------------------------------
    // Sin búsqueda
    // ---------------------------------------------------------

    if (!term) {

      this.filteredLaboratories =
        [...this.laboratories];

      return;

    }


    // ---------------------------------------------------------
    // Con búsqueda
    // ---------------------------------------------------------

    this.filteredLaboratories =
      this.laboratories.filter(
        (laboratory: Laboratory) => {

          const name =
            laboratory.UMG_Nombre
              ?.toLowerCase() ?? '';


          const id =
            String(
              laboratory.UMG_ID ?? ''
            );


          return (
            name.includes(term) ||
            id.includes(term)
          );

        }
      );

  }


  // =========================================================
  // NUEVO LABORATORIO
  // =========================================================

  openLaboratoryModal(): void {

    console.log(
      '🔥 CLICK EN NUEVO LABORATORIO'
    );


    this.editingLaboratoryId = null;

    this.errorMessage = '';

    this.successMessage = '';


    this.resetLaboratoryForm();


    this.showLaboratoryModal = true;


    console.log(
      '🪟 showLaboratoryModal:',
      this.showLaboratoryModal
    );


    this.cdr.detectChanges();

  }


  // =========================================================
  // EDITAR LABORATORIO
  // =========================================================

  editLaboratory(
    laboratory: Laboratory
  ): void {

    console.log(
      '✏️ EDITAR LABORATORIO:',
      laboratory
    );


    this.errorMessage = '';

    this.successMessage = '';


    this.editingLaboratoryId =
      laboratory.UMG_ID;


    this.newLaboratory = {

      UMG_Nombre:
        laboratory.UMG_Nombre,

      UMG_Estado:
        laboratory.UMG_Estado,

      UMG_Reserva:
        laboratory.UMG_Reserva

    };


    this.showLaboratoryModal = true;


    console.log(
      '✏️ Modal de edición abierto:',
      this.editingLaboratoryId
    );


    this.cdr.detectChanges();

  }


  // =========================================================
  // CERRAR MODAL
  // =========================================================

  closeLaboratoryModal(): void {

    if (this.saving) {

      return;

    }


    this.showLaboratoryModal = false;

    this.editingLaboratoryId = null;

    this.errorMessage = '';


    this.cdr.detectChanges();

  }


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  resetLaboratoryForm(): void {

    this.newLaboratory = {

      UMG_Nombre: '',

      UMG_Estado: 1,

      UMG_Reserva: 'D'

    };

  }


  // =========================================================
  // CREAR / ACTUALIZAR LABORATORIO
  // =========================================================

  createLaboratory(): void {

    console.log(
      '🔥 CREATE / UPDATE LABORATORY EJECUTADO'
    );


    this.errorMessage = '';

    this.successMessage = '';


    // ---------------------------------------------------------
    // VALIDACIÓN
    // ---------------------------------------------------------

    if (
      !this.newLaboratory.UMG_Nombre.trim()
    ) {

      this.errorMessage =
        'El nombre del laboratorio es obligatorio.';

      return;

    }


    // ---------------------------------------------------------
    // PAYLOAD
    // ---------------------------------------------------------

    const payload = {

      UMG_Nombre:
        this.newLaboratory.UMG_Nombre.trim(),

      UMG_Estado:
        Number(
          this.newLaboratory.UMG_Estado
        ),

      UMG_Reserva:
        this.newLaboratory.UMG_Reserva

    };


    console.log(
      '📤 PAYLOAD LABORATORIO:',
      payload
    );


    // ---------------------------------------------------------
    // ACTUALIZAR
    // ---------------------------------------------------------

    if (
      this.editingLaboratoryId !== null
    ) {

      this.updateLaboratory(
        this.editingLaboratoryId,
        payload
      );

      return;

    }


    // ---------------------------------------------------------
    // CREAR
    // ---------------------------------------------------------

    this.saving = true;


    this.api
      .createLaboratory(payload)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ LABORATORIO CREADO:',
            response
          );


          this.saving = false;

          this.showLaboratoryModal = false;

          this.editingLaboratoryId = null;


          this.resetLaboratoryForm();


          this.successMessage =
            'Laboratorio creado correctamente.';


          this.cdr.detectChanges();


          // Recargar información

          this.loadLaboratories();

        },


        error: (error) => {

          console.error(
            '❌ ERROR CREANDO LABORATORIO:',
            error
          );


          console.error(
            '❌ RESPUESTA DEL SERVIDOR:',
            error?.error
          );


          this.saving = false;


          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            error?.error?.message ||
            'No fue posible crear el laboratorio.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // ACTUALIZAR LABORATORIO
  // =========================================================

  updateLaboratory(
    id: number,
    payload: any
  ): void {

    console.log(
      `✏️ PATCH /api/labs/${id}/`,
      payload
    );


    this.saving = true;


    this.api
      .updateLaboratory(
        id,
        payload
      )
      .subscribe({

        next: (response) => {

          console.log(
            '✅ LABORATORIO ACTUALIZADO:',
            response
          );


          this.saving = false;

          this.showLaboratoryModal = false;

          this.editingLaboratoryId = null;


          this.resetLaboratoryForm();


          this.successMessage =
            'Laboratorio actualizado correctamente.';


          this.cdr.detectChanges();


          // Recargar información

          this.loadLaboratories();

        },


        error: (error) => {

          console.error(
            '❌ ERROR ACTUALIZANDO LABORATORIO:',
            error
          );


          console.error(
            '❌ RESPUESTA DEL SERVIDOR:',
            error?.error
          );


          this.saving = false;


          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            error?.error?.message ||
            'No fue posible actualizar el laboratorio.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // ELIMINAR LABORATORIO
  // =========================================================

  deleteLaboratory(
    laboratory: Laboratory
  ): void {

    console.log(
      '🗑️ ELIMINAR LABORATORIO:',
      laboratory
    );


    const confirmed =
      window.confirm(
        `¿Está seguro de eliminar el laboratorio "${laboratory.UMG_Nombre}"?`
      );


    if (!confirmed) {

      console.log(
        '❌ Eliminación cancelada'
      );

      return;

    }


    this.deleting = true;

    this.errorMessage = '';

    this.successMessage = '';


    console.log(
      `🗑️ DELETE /api/labs/${laboratory.UMG_ID}/`
    );


    this.api
      .deleteLaboratory(
        laboratory.UMG_ID
      )
      .subscribe({

        next: (response) => {

          console.log(
            '✅ LABORATORIO ELIMINADO:',
            response
          );


          this.deleting = false;


          this.successMessage =
            'Laboratorio eliminado correctamente.';


          this.cdr.detectChanges();


          // Recargar información

          this.loadLaboratories();

        },


        error: (error) => {

          console.error(
            '❌ ERROR ELIMINANDO LABORATORIO:',
            error
          );


          console.error(
            '❌ RESPUESTA DEL SERVIDOR:',
            error?.error
          );


          this.deleting = false;


          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            error?.error?.message ||
            'No fue posible eliminar el laboratorio.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // TEXTO DEL ESTADO
  // =========================================================

  getStatusText(
    status: number
  ): string {

    return Number(status) === 1
      ? 'Activo'
      : 'Inactivo';

  }


  // =========================================================
  // DISPONIBILIDAD
  // =========================================================

  getReservationStatus(
    reservation: string
  ): string {

    return reservation === 'D'
      ? 'Disponible'
      : 'No disponible';

  }


  // =========================================================
  // CLASE DISPONIBILIDAD
  // =========================================================

  isAvailable(
    reservation: string
  ): boolean {

    return reservation === 'D';

  }


  // =========================================================
  // TRACKING
  // =========================================================

  trackByLaboratoryId(
    index: number,
    laboratory: Laboratory
  ): number {

    return laboratory.UMG_ID;

  }

}