import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
import { Laboratories } from './pages/laboratories/laboratories';
import { Reservations } from './pages/reservations/reservations';
import { Locks } from './pages/locks/locks';
import { Settings } from './pages/settings/settings';

import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [

  // =========================================
  // LOGIN
  // =========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },


  // =========================================
  // APLICACIÓN PRINCIPAL
  // =========================================

  {
    path: '',
    component: MainLayout,

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'users',
        component: Users
      },

      {
        path: 'laboratories',
        component: Laboratories
      },

      {
        path: 'locks',
        component: Locks
      },

      {
        path: 'reservations',
        component: Reservations
      },

      {
        path: 'settings',
        component: Settings
      }

    ]
  },


  // =========================================
  // RUTA NO ENCONTRADA
  // =========================================

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];