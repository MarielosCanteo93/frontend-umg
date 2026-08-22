import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api';

interface Reservation {

  UMG_ID: number;

  UMG_User_ID: number;

  UMG_Docente_Nombre: string;

  UMG_Docente_Correo: string;

  UMG_Lab_ID: number;

  UMG_Lab_Nombre: string;

  UMG_Fecha_Reserva: string;

  UMG_Hora_Inicio: string;

  UMG_Hora_Fin: string;

  UMG_Motivo: string;

  UMG_Estado: string;

  UMG_Fecha_Registro: string;
}


interface Laboratory {

  UMG_ID: number;

  UMG_Nombre: string;

  UMG_Estado: number;

  UMG_Reserva: string;
}


interface User {

  UMG_ID: number;

  UMG_Usuario: string;

  UMG_Nombre: string;

  UMG_Apellido: string;

  UMG_Rol_ID: number;

  UMG_Rol_Nombre: string;

  UMG_Estado: number;
}


@Component({

  selector: 'app-reservations',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './reservations.html',

  styleUrl: './reservations.css'

})


export class Reservations implements OnInit {


  // =========================================================
  // DATOS
  // =========================================================

  reservations: Reservation[] = [];

  filteredReservations: Reservation[] = [];

  laboratories: Laboratory[] = [];

  users: User[] = [];

  searchTerm = '';

  loading = false;

  saving = false;

  errorMessage = '';

  successMessage = '';


  // =========================================================
  // MODALES
  // =========================================================

  showReservationModal = false;

  showDetailModal = false;


  // =========================================================
  // EDICIÓN
  // =========================================================

  editingReservationId: number | null = null;


  // =========================================================
  // RESERVA SELECCIONADA
  // =========================================================

  selectedReservation: Reservation | null = null;


  // =========================================================
  // FORMULARIO
  // =========================================================

  newReservation = {

    UMG_User_ID: null as number | null,

    UMG_Lab_ID: null as number | null,

    UMG_Fecha_Reserva: '',

    UMG_Hora_Inicio: '',

    UMG_Hora_Fin: '',

    UMG_Motivo: ''

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

    this.loadReservations();

    this.loadUsers();

    this.loadLaboratories();

  }


  // =========================================================
  // CARGAR RESERVACIONES
  // =========================================================

  loadReservations(): void {

    this.loading = true;

    this.errorMessage = '';

    this.api.getReservations().subscribe({

      next: (response) => {

        console.log(
          'Reservaciones recibidas:',
          response
        );


        if (Array.isArray(response)) {

          this.reservations = response;

        }

        else if (response?.results) {

          this.reservations = response.results;

        }

        else {

          this.reservations = [];

        }


        this.applyFilter();

        this.loading = false;

        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Error cargando reservaciones:',
          error
        );


        this.reservations = [];

        this.filteredReservations = [];


        this.errorMessage =
          'No fue posible cargar las reservaciones.';


        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }


  // =========================================================
  // CARGAR USUARIOS
  // =========================================================

  loadUsers(): void {

    this.api.getUsers().subscribe({

      next: (response) => {

        console.log(
          'Usuarios para reserva:',
          response
        );


        if (Array.isArray(response)) {

          this.users = response;

        }

        else if (response?.results) {

          this.users = response.results;

        }

        else {

          this.users = [];

        }

      },


      error: (error) => {

        console.error(
          'Error cargando usuarios:',
          error
        );

      }

    });

  }


  // =========================================================
  // CARGAR LABORATORIOS
  // =========================================================

  loadLaboratories(): void {

    this.api.getLaboratories().subscribe({

      next: (response) => {

        console.log(
          'Laboratorios para reserva:',
          response
        );


        if (Array.isArray(response)) {

          this.laboratories = response;

        }

        else if (response?.results) {

          this.laboratories = response.results;

        }

        else {

          this.laboratories = [];

        }

      },


      error: (error) => {

        console.error(
          'Error cargando laboratorios:',
          error
        );

      }

    });

  }


  // =========================================================
  // NUEVA RESERVA
  // =========================================================

  openReservationModal(): void {

    console.log(
      '🔥 CLICK EN NUEVA RESERVA'
    );


    this.editingReservationId = null;

    this.errorMessage = '';

    this.successMessage = '';

    this.resetReservationForm();

    this.showReservationModal = true;


    console.log(
      'showReservationModal:',
      this.showReservationModal
    );

  }


  // =========================================================
  // CERRAR MODAL RESERVA
  // =========================================================

  closeReservationModal(): void {

    if (this.saving) {

      return;

    }


    this.showReservationModal = false;

    this.editingReservationId = null;

    this.errorMessage = '';

  }


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  resetReservationForm(): void {

    this.newReservation = {

      UMG_User_ID: null,

      UMG_Lab_ID: null,

      UMG_Fecha_Reserva: '',

      UMG_Hora_Inicio: '',

      UMG_Hora_Fin: '',

      UMG_Motivo: ''

    };

  }


  // =========================================================
  // CREAR RESERVA
  // =========================================================

  createReservation(): void {

    console.log(
      '🔥 CREATE RESERVATION EJECUTADO'
    );


    this.errorMessage = '';

    this.successMessage = '';


    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    if (!this.newReservation.UMG_User_ID) {

      this.errorMessage =
        'Debe seleccionar un docente.';

      return;

    }


    if (!this.newReservation.UMG_Lab_ID) {

      this.errorMessage =
        'Debe seleccionar un laboratorio.';

      return;

    }


    if (!this.newReservation.UMG_Fecha_Reserva) {

      this.errorMessage =
        'Debe seleccionar la fecha de la reserva.';

      return;

    }


    if (!this.newReservation.UMG_Hora_Inicio) {

      this.errorMessage =
        'Debe indicar la hora de inicio.';

      return;

    }


    if (!this.newReservation.UMG_Hora_Fin) {

      this.errorMessage =
        'Debe indicar la hora de finalización.';

      return;

    }


    if (
      this.newReservation.UMG_Hora_Fin <=
      this.newReservation.UMG_Hora_Inicio
    ) {

      this.errorMessage =
        'La hora de finalización debe ser posterior a la hora de inicio.';

      return;

    }


    if (
      !this.newReservation.UMG_Motivo.trim()
    ) {

      this.errorMessage =
        'Debe indicar el motivo de la reserva.';

      return;

    }


    // -------------------------------------------------------
    // VALIDACIÓN HORARIO FACULTAD
    // -------------------------------------------------------

    if (
      this.newReservation.UMG_Hora_Inicio < '07:00' ||
      this.newReservation.UMG_Hora_Fin > '22:00'
    ) {

      this.errorMessage =
        'El horario permitido para las reservas es de 07:00 a 22:00.';

      return;

    }


    // -------------------------------------------------------
    // PAYLOAD
    // -------------------------------------------------------

    const payload = {

      UMG_User_ID:
        Number(
          this.newReservation.UMG_User_ID
        ),

      UMG_Lab_ID:
        Number(
          this.newReservation.UMG_Lab_ID
        ),

      UMG_Fecha_Reserva:
        this.newReservation.UMG_Fecha_Reserva,

      UMG_Hora_Inicio:
        this.newReservation.UMG_Hora_Inicio,

      UMG_Hora_Fin:
        this.newReservation.UMG_Hora_Fin,

      UMG_Motivo:
        this.newReservation.UMG_Motivo.trim()

    };


    console.log(
      '📤 POST /api/reservas/',
      payload
    );


    this.saving = true;


    this.api
      .createReservation(payload)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Reserva creada:',
            response
          );


          this.saving = false;


          // CERRAR MODAL

          this.showReservationModal = false;

          this.editingReservationId = null;


          // LIMPIAR

          this.resetReservationForm();


          // MENSAJE

          this.successMessage =
            'Reserva creada correctamente.';


          // ACTUALIZAR TABLA

          this.loadReservations();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            '❌ Error creando reserva:',
            error
          );


          console.error(
            'Respuesta del servidor:',
            error?.error
          );


          this.saving = false;


          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            error?.error?.message ||
            'No fue posible crear la reserva.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // VER DETALLE
  // =========================================================

  viewReservation(
    reservation: Reservation
  ): void {

    console.log(
      '👁️ VER RESERVA:',
      reservation
    );


    this.selectedReservation =
      reservation;


    this.showDetailModal = true;

  }


  // =========================================================
  // CERRAR DETALLE
  // =========================================================

  closeDetailModal(): void {

    this.showDetailModal = false;

    this.selectedReservation = null;

  }


  // =========================================================
  // EDITAR RESERVA
  // =========================================================

  editReservation(
    reservation: Reservation
  ): void {

    console.log(
      '✏️ EDITAR RESERVA:',
      reservation
    );


    this.editingReservationId =
      reservation.UMG_ID;


    this.errorMessage = '';

    this.successMessage = '';


    this.newReservation = {

      UMG_User_ID:
        reservation.UMG_User_ID,

      UMG_Lab_ID:
        reservation.UMG_Lab_ID,

      UMG_Fecha_Reserva:
        reservation.UMG_Fecha_Reserva,

      UMG_Hora_Inicio:
        reservation.UMG_Hora_Inicio,

      UMG_Hora_Fin:
        reservation.UMG_Hora_Fin,

      UMG_Motivo:
        reservation.UMG_Motivo

    };


    this.showReservationModal = true;


    this.cdr.detectChanges();

  }


  // =========================================================
  // ACTUALIZAR RESERVA
  // =========================================================

  updateReservation(): void {

    if (
      this.editingReservationId === null
    ) {

      return;

    }


    console.log(
      '💾 ACTUALIZAR RESERVA:',
      this.editingReservationId
    );


    this.errorMessage = '';

    this.successMessage = '';


    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    if (!this.newReservation.UMG_User_ID) {

      this.errorMessage =
        'Debe seleccionar un docente.';

      return;

    }


    if (!this.newReservation.UMG_Lab_ID) {

      this.errorMessage =
        'Debe seleccionar un laboratorio.';

      return;

    }


    if (!this.newReservation.UMG_Fecha_Reserva) {

      this.errorMessage =
        'Debe seleccionar la fecha de la reserva.';

      return;

    }


    if (!this.newReservation.UMG_Hora_Inicio) {

      this.errorMessage =
        'Debe indicar la hora de inicio.';

      return;

    }


    if (!this.newReservation.UMG_Hora_Fin) {

      this.errorMessage =
        'Debe indicar la hora de finalización.';

      return;

    }


    if (
      this.newReservation.UMG_Hora_Fin <=
      this.newReservation.UMG_Hora_Inicio
    ) {

      this.errorMessage =
        'La hora de finalización debe ser posterior a la hora de inicio.';

      return;

    }


    if (
      !this.newReservation.UMG_Motivo.trim()
    ) {

      this.errorMessage =
        'Debe indicar el motivo de la reserva.';

      return;

    }


    if (
      this.newReservation.UMG_Hora_Inicio < '07:00' ||
      this.newReservation.UMG_Hora_Fin > '22:00'
    ) {

      this.errorMessage =
        'El horario permitido para las reservas es de 07:00 a 22:00.';

      return;

    }


    // -------------------------------------------------------
    // PAYLOAD
    // -------------------------------------------------------

    const payload = {

      UMG_User_ID:
        Number(
          this.newReservation.UMG_User_ID
        ),

      UMG_Lab_ID:
        Number(
          this.newReservation.UMG_Lab_ID
        ),

      UMG_Fecha_Reserva:
        this.newReservation.UMG_Fecha_Reserva,

      UMG_Hora_Inicio:
        this.newReservation.UMG_Hora_Inicio,

      UMG_Hora_Fin:
        this.newReservation.UMG_Hora_Fin,

      UMG_Motivo:
        this.newReservation.UMG_Motivo.trim()

    };


    console.log(
      '📤 PATCH /api/reservas/',
      payload
    );


    this.saving = true;


    this.api
      .updateReservation(
        this.editingReservationId,
        payload
      )
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Reserva actualizada:',
            response
          );


          this.saving = false;


          // CERRAR MODAL

          this.showReservationModal = false;

          this.editingReservationId = null;


          // LIMPIAR

          this.resetReservationForm();


          // MENSAJE

          this.successMessage =
            'Reserva actualizada correctamente.';


          // RECARGAR

          this.loadReservations();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            '❌ Error actualizando reserva:',
            error
          );


          console.error(
            'Respuesta del servidor:',
            error?.error
          );


          this.saving = false;


          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            error?.error?.message ||
            'No fue posible actualizar la reserva.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CANCELAR RESERVA
  // =========================================================

  cancelReservation(
    reservation: Reservation
  ): void {

    console.log(
      '🗑️ CANCELAR RESERVA:',
      reservation
    );


    const confirmed =
      window.confirm(

        `¿Está seguro de cancelar esta reserva?\n\n` +

        `Docente: ${reservation.UMG_Docente_Nombre}\n` +

        `Laboratorio: ${reservation.UMG_Lab_Nombre}\n` +

        `Fecha: ${reservation.UMG_Fecha_Reserva}\n` +

        `Horario: ${reservation.UMG_Hora_Inicio} - ${reservation.UMG_Hora_Fin}`

      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.api
      .cancelReservation(
        reservation.UMG_ID
      )
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Reserva cancelada:',
            response
          );


          this.successMessage =
            'Reserva cancelada correctamente.';


          this.loadReservations();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            '❌ Error cancelando reserva:',
            error
          );


          console.error(
            'Respuesta del servidor:',
            error?.error
          );


          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            error?.error?.message ||
            'No fue posible cancelar la reserva.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // BÚSQUEDA
  // =========================================================

  searchReservations(): void {

    this.applyFilter();

  }


  private applyFilter(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!term) {

      this.filteredReservations =
        [...this.reservations];

      return;

    }


    this.filteredReservations =
      this.reservations.filter(

        (reservation: Reservation) => {

          const teacher =
            reservation.UMG_Docente_Nombre
              ?.toLowerCase() ?? '';


          const email =
            reservation.UMG_Docente_Correo
              ?.toLowerCase() ?? '';


          const laboratory =
            reservation.UMG_Lab_Nombre
              ?.toLowerCase() ?? '';


          const reason =
            reservation.UMG_Motivo
              ?.toLowerCase() ?? '';


          const status =
            reservation.UMG_Estado
              ?.toLowerCase() ?? '';


          return (

            teacher.includes(term) ||

            email.includes(term) ||

            laboratory.includes(term) ||

            reason.includes(term) ||

            status.includes(term)

          );

        }

      );

  }


  // =========================================================
  // ESTADO
  // =========================================================

  getStatusClass(
    status: string
  ): string {

    const normalizedStatus =
      status
        ?.toLowerCase()
        .trim() ?? '';


    if (
      normalizedStatus.includes('cancel')
    ) {

      return 'cancelled';

    }


    if (
      normalizedStatus.includes('complet')
    ) {

      return 'completed';

    }


    if (
      normalizedStatus.includes('pend')
    ) {

      return 'pending';

    }


    if (
      normalizedStatus.includes('activ') ||
      normalizedStatus.includes('confirm')
    ) {

      return 'active';

    }


    return 'default';

  }


  // =========================================================
  // TRACKING
  // =========================================================

  trackByReservationId(
    index: number,
    reservation: Reservation
  ): number {

    return reservation.UMG_ID;

  }

}