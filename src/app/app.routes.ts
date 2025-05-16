import { Routes } from '@angular/router';

export const routes: Routes = [


  {
    path: 'menuNavbar',
    loadComponent: () => import('./components/MenuNavbar/MenuNavbarPag1.component'),
    children: [

      {
        path: 'aboutMePag1',
        loadComponent: () => import('./pages/AboutMePag1/HomePag2.component'),
      },
      {
        path: 'proyectsPag2',
        loadComponent: () => import('./pages/ProyectsPag2/aboutMePag3.component'),
      },
      {
        path: 'ContactPag3',
        loadComponent: () => import('./pages/ContactamePag3/projetcsPag4.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/menuNavbar/aboutMePag1',
  },
];
