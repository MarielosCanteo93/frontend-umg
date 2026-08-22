import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api';
import { UsersService } from '../../core/services/users.service';

interface User {

  UMG_ID: number;

  UMG_Usuario: string;

  UMG_Nombre: string;

  UMG_Apellido: string;

  UMG_Rol_ID: number;

  UMG_Rol_Nombre: string;

  UMG_Estado: number;

  UMG_Ingreso: number;

  UMG_Fecha_Creacion: string;

  UMG_Ultimo_Acceso: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users: User[] = [];

  filteredUsers: User[] = [];

  searchTerm = '';

  loading = false;

  saving = false;

  errorMessage = '';

  successMessage = '';

  showUserModal = false;

  editingUserId: number | null = null;

  newUser = {

    UMG_Usuario: '',

    UMG_Contrasena: '',

    UMG_Nombre: '',

    UMG_Apellido: '',

    UMG_Rol_ID: 0,

    UMG_Rol_Nombre: '',

    UMG_Estado: 1,

    UMG_Ingreso: 1

  };


  constructor(
    private readonly api: ApiService,
    private readonly usersService: UsersService
  ) {}


  // =========================================================
  // INICIO
  // =========================================================

  ngOnInit(): void {

    this.loadUsers();

  }


  // =========================================================
  // CARGAR USUARIOS
  // =========================================================

  loadUsers(): void {

    this.loading = true;

    this.errorMessage = '';

    this.api.getUsers().subscribe({

      next: (response: any) => {

        console.log(
          'Usuarios recibidos:',
          response
        );

        this.users =
          this.normalizeUsersResponse(response);

        this.applyFilter();

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Error cargando usuarios:',
          error
        );

        this.users = [];

        this.filteredUsers = [];

        this.errorMessage =
          'No fue posible cargar los usuarios.';

        this.loading = false;

      }

    });

  }


  // =========================================================
  // NORMALIZAR RESPUESTA
  // =========================================================

  private normalizeUsersResponse(
    response: any
  ): User[] {

    if (Array.isArray(response)) {

      return response;

    }

    if (response?.results &&
        Array.isArray(response.results)) {

      return response.results;

    }

    if (response) {

      return [response];

    }

    return [];

  }


  // =========================================================
  // BUSCAR
  // =========================================================

  searchUsers(): void {

    this.applyFilter();

  }


  private applyFilter(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (!term) {

      this.filteredUsers =
        [...this.users];

      return;

    }

    this.filteredUsers =
      this.users.filter(
        (user: User) => {

          const searchableText = [

            user.UMG_Usuario,

            user.UMG_Nombre,

            user.UMG_Apellido,

            user.UMG_Rol_Nombre

          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchableText.includes(term);

        }
      );

  }


  // =========================================================
  // NUEVO USUARIO
  // =========================================================

  openUserModal(): void {

    console.log(
      '🔥 CLICK EN NUEVO USUARIO'
    );

    this.editingUserId = null;

    this.successMessage = '';

    this.errorMessage = '';

    this.resetUserForm();

    this.showUserModal = true;

    console.log(
      'showUserModal:',
      this.showUserModal
    );

  }


  // =========================================================
  // EDITAR USUARIO
  // =========================================================

  editUser(user: User): void {

    console.log(
      '✏️ Editando usuario:',
      user
    );

    this.editingUserId =
      user.UMG_ID;

    this.errorMessage = '';

    this.successMessage = '';

    this.newUser = {

      UMG_Usuario:
        user.UMG_Usuario || '',

      UMG_Contrasena:
        '',

      UMG_Nombre:
        user.UMG_Nombre || '',

      UMG_Apellido:
        user.UMG_Apellido || '',

      UMG_Rol_ID:
        user.UMG_Rol_ID || 0,

      UMG_Rol_Nombre:
        user.UMG_Rol_Nombre || '',

      UMG_Estado:
        user.UMG_Estado ?? 1,

      UMG_Ingreso:
        user.UMG_Ingreso ?? 1

    };

    this.showUserModal = true;

  }


  // =========================================================
  // CERRAR MODAL
  // =========================================================

  closeUserModal(): void {

    if (this.saving) {

      return;

    }

    this.showUserModal = false;

    this.editingUserId = null;

  }


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  resetUserForm(): void {

    this.newUser = {

      UMG_Usuario: '',

      UMG_Contrasena: '',

      UMG_Nombre: '',

      UMG_Apellido: '',

      UMG_Rol_ID: 0,

      UMG_Rol_Nombre: '',

      UMG_Estado: 1,

      UMG_Ingreso: 1

    };

  }


  // =========================================================
  // CREAR / EDITAR USUARIO
  // =========================================================

  createUser(): void {

    console.log(
      '🔥 CREATE USER EJECUTADO'
    );

    this.errorMessage = '';

    this.successMessage = '';


    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    if (
      !this.newUser.UMG_Usuario.trim()
    ) {

      this.errorMessage =
        'El correo electrónico es obligatorio.';

      return;

    }


    if (
      !this.newUser.UMG_Nombre.trim()
    ) {

      this.errorMessage =
        'El nombre es obligatorio.';

      return;

    }


    if (
      !this.newUser.UMG_Apellido.trim()
    ) {

      this.errorMessage =
        'El apellido es obligatorio.';

      return;

    }


    if (
      !this.newUser.UMG_Rol_ID ||
      this.newUser.UMG_Rol_ID < 1
    ) {

      this.errorMessage =
        'Selecciona un ID de rol válido.';

      return;

    }


    // -------------------------------------------------------
    // CREAR
    // -------------------------------------------------------

    if (this.editingUserId === null) {

      if (
        !this.newUser.UMG_Contrasena.trim()
      ) {

        this.errorMessage =
          'La contraseña es obligatoria.';

        return;

      }


      if (
        this.newUser.UMG_Contrasena.length < 6
      ) {

        this.errorMessage =
          'La contraseña debe tener al menos 6 caracteres.';

        return;

      }


      const payload = {

        UMG_Contrasena:
          this.newUser.UMG_Contrasena,

        UMG_Rol_ID:
          Number(this.newUser.UMG_Rol_ID),

        UMG_Nombre:
          this.newUser.UMG_Nombre.trim(),

        UMG_Apellido:
          this.newUser.UMG_Apellido.trim(),

        UMG_Usuario:
          this.newUser.UMG_Usuario.trim()

      };


      console.log(
        '📤 POST /api/usuarios/',
        payload
      );


      this.saving = true;


      this.usersService
        .create(payload)
        .subscribe({

          next: (response) => {

            console.log(
              '✅ Usuario creado:',
              response
            );

            this.saving = false;

            this.showUserModal = false;

            this.successMessage =
              'Usuario creado correctamente.';

            this.loadUsers();

          },

          error: (error) => {

            console.error(
              '❌ Error creando usuario:',
              error
            );

            this.saving = false;

            this.errorMessage =
              error?.error?.mensaje ||
              error?.error?.detail ||
              'No fue posible crear el usuario.';

          }

        });

      return;

    }


    // -------------------------------------------------------
    // EDITAR
    // -------------------------------------------------------

    const updatePayload: any = {

      UMG_Rol_ID:
        Number(this.newUser.UMG_Rol_ID),

      UMG_Nombre:
        this.newUser.UMG_Nombre.trim(),

      UMG_Apellido:
        this.newUser.UMG_Apellido.trim(),

      UMG_Usuario:
        this.newUser.UMG_Usuario.trim(),

      UMG_Estado:
        Number(this.newUser.UMG_Estado),

      UMG_Ingreso:
        Number(this.newUser.UMG_Ingreso)

    };


    if (
      this.newUser.UMG_Contrasena.trim()
    ) {

      updatePayload.UMG_Contrasena =
        this.newUser.UMG_Contrasena;

    }


    console.log(
      `📤 PATCH /api/usuarios/${this.editingUserId}/`,
      updatePayload
    );


    this.saving = true;


    this.usersService
      .update(
        this.editingUserId,
        updatePayload
      )
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Usuario actualizado:',
            response
          );

          this.saving = false;

          this.showUserModal = false;

          this.editingUserId = null;

          this.successMessage =
            'Usuario actualizado correctamente.';

          this.loadUsers();

        },

        error: (error) => {

          console.error(
            '❌ Error actualizando usuario:',
            error
          );

          this.saving = false;

          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            'No fue posible actualizar el usuario.';

        }

      });

  }


  // =========================================================
  // ELIMINAR
  // =========================================================

  deleteUser(user: User): void {

    if (
      !window.confirm(
        `¿Eliminar al usuario ${user.UMG_Usuario}?`
      )
    ) {

      return;

    }


    console.log(
      '🗑️ Eliminando usuario:',
      user
    );


    this.api
      .deleteUser(user.UMG_ID)
      .subscribe({

        next: () => {

          this.successMessage =
            'Usuario eliminado correctamente.';

          this.loadUsers();

        },

        error: (error) => {

          console.error(
            'Error eliminando usuario:',
            error
          );

          this.errorMessage =
            error?.error?.mensaje ||
            error?.error?.detail ||
            'No fue posible eliminar el usuario.';

        }

      });

  }


  // =========================================================
  // ESTADO
  // =========================================================

  getStatusText(
    status: number
  ): string {

    return status === 1
      ? 'Activo'
      : 'Inactivo';

  }


  // =========================================================
  // TRACKING
  // =========================================================

  trackByUserId(
    index: number,
    user: User
  ): number {

    return user.UMG_ID;

  }

}