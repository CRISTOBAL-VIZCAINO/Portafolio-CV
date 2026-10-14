import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('Rutas', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
  });

  for (const [url, title] of [
    ['/', 'Acerca de mí'],
    ['/proyectos', 'Proyectos'],
    ['/contacto', 'Contacto'],
  ]) {
    it(`${url} abre "${title}"`, async () => {
      await harness.navigateByUrl(url);
      expect(router.url).toBe(url);
      expect(document.title).toContain(title);
    });
  }

  // Las URLs antiguas siguen publicadas (CV en PDF, enlaces externos): no se pueden romper.
  for (const [legacy, target] of [
    ['/menuNavbar/aboutMePag1', '/'],
    ['/menuNavbar/proyectsPag2', '/proyectos'],
    ['/menuNavbar/contactPag3', '/contacto'],
    ['/menuNavbar', '/'],
    ['/menuNavbar/proyectsPag2#reconciliacion', '/proyectos#reconciliacion'],
  ]) {
    it(`la URL antigua ${legacy} redirige a ${target}`, async () => {
      await harness.navigateByUrl(legacy);
      expect(router.url).toBe(target);
    });
  }

  it('una ruta desconocida lleva a inicio', async () => {
    await harness.navigateByUrl('/no-existe');
    expect(router.url).toBe('/');
  });
});
