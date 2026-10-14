import { Routes } from '@angular/router';
import LayoutComponent from './layout/layout.component';
import HomeComponent from './pages/home/home.component';

const TITLE = 'Cristóbal Vizcaíno';

/**
 * URLs anteriores a octubre de 2026. Siguen en el CV en PDF, en el sitemap antiguo y en enlaces externos, así que
 * no se pueden quitar. En producción las resuelve Netlify con un 301 (public/_redirects); estas rutas cubren el
 * servidor de desarrollo y cualquier otro hosting. Conservan el ancla: /menuNavbar/proyectsPag2#x → /proyectos#x.
 */
export const LEGACY_REDIRECTS: Routes = [
  { path: 'menuNavbar/aboutMePag1', redirectTo: '' },
  { path: 'menuNavbar/proyectsPag2', redirectTo: 'proyectos' },
  { path: 'menuNavbar/contactPag3', redirectTo: 'contacto' },
  { path: 'menuNavbar', pathMatch: 'full', redirectTo: '' },
];

// Layout e inicio van en el bundle inicial: inicio es la página de entrada (y el destino de cualquier ruta
// desconocida), y cargarlo en diferido añadía dos descargas encadenadas antes de poder pedir la foto (LCP).
// Medido con Lighthouse (throttling devtools): LCP de inicio 3,87 s → 2,72 s; proyectos 3,10 s → 2,57 s.
// Proyectos y contacto se cargan en diferido.
export const routes: Routes = [
  ...LEGACY_REDIRECTS,
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: `Acerca de mí | ${TITLE}`,
        component: HomeComponent,
      },
      {
        path: 'proyectos',
        title: `Proyectos | ${TITLE}`,
        loadComponent: () => import('./pages/projects/projects.component'),
      },
      {
        path: 'contacto',
        title: `Contacto | ${TITLE}`,
        loadComponent: () => import('./pages/contact/contact.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
