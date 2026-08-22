import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  errorMessage = '';
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  login() {

    console.log('=================================');
    console.log('LOGIN EJECUTADO');
    console.log('Usuario:', this.username);
    console.log('Enviando petición a Django...');
    console.log('=================================');

    this.errorMessage = '';
    this.loading = true;

    this.api.login(this.username, this.password).subscribe({

      next: (response) => {

        console.log('✅ RESPUESTA DE DJANGO:', response);

        this.loading = false;

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.error('❌ ERROR DE DJANGO:', error);

        this.loading = false;

        this.errorMessage =
          'No fue posible iniciar sesión. Revisa las credenciales.';

      }

    });

  }

}