# Portafolio CJVM

Portafolio personal de Cristóbal Vizcaíno. Angular 19 (standalone, OnPush) + Tailwind CSS 4. El formulario de contacto guarda los mensajes en Supabase (API REST, sin SDK). Se despliega en Netlify.

## Comandos

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:4200
npm run build      # build de producción en dist/portafolio-cjvm
npm test           # pruebas unitarias (Karma + Jasmine); en Linux: CHROME_BIN=/usr/bin/google-chrome-stable npx ng test --watch=false --browsers=ChromeHeadless
npm run images     # convierte PNG/JPG nuevos de public/images/ (y subcarpetas) a WebP (máx. 1600 px de ancho)
```

## Estructura

```
src/app/
├── layout/      navbar + <router-outlet> + footer (común a todas las páginas)
├── pages/       home ("Acerca de mí"), projects (+ carrusel), contact (+ servicio de Supabase)
├── shared/      tech-icon (logo de tecnología) y motion (respeta "reducir movimiento"), usados por varias páginas
└── data/        contenido tipado: proyectos, habilidades, catálogo de tecnologías y sus tipos
src/environments/  URL y clave pública (anon) de Supabase
public/images/   profile/, projects/<proyecto>/NN.webp, technologies/*.svg
docs/            ARQUITECTURA.md (fuente de verdad), AUDITORIA_FINAL_FRONTEND.md (estado verificado),
                 AUDITORIA_RESPONSIVE.md (+ evidencias/responsive/), AUDITORIA_FRONTEND.md (histórico), CV en Markdown
.cursor/rules/   reglas para Cursor (resumen operativo de docs/ARQUITECTURA.md)
```

Las rutas son `/` (Acerca de mí), `/proyectos` (con anclas por proyecto, ej. `/proyectos#reconciliacion`) y `/contacto`. Las URLs anteriores (`/menuNavbar/...`) redirigen a las nuevas: 301 en Netlify y redirección del router como respaldo. El layout y la página de inicio van en el bundle inicial; proyectos y contacto se cargan con lazy loading. Detalle completo en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md); qué documento cubre cada tema y cómo se mantienen alineados con las reglas de Cursor, en su §10.

## Reglas para mantener el rendimiento

- **Imágenes nuevas:** copia el PNG/JPG a `public/images/projects/<proyecto>/` (o la carpeta que corresponda), ejecuta `npm run images`, usa el `.webp` resultante y saca el original del repo. Una captura debe pesar unos 100 KB, no 1–2 MB. El repositorio es público: difumina nombres de clientes o datos internos antes de publicar una captura.
- **Imágenes en plantillas:** las que no estén en la primera pantalla llevan `loading="lazy"`; si usan `h-auto`, añade `width` y `height` para evitar saltos de diseño.
- **Dependencias:** el bundle inicial es Angular (core + router), zone.js, el layout, el footer y la página de inicio con sus datos; antes de añadir una librería, comprueba su peso con `npm run build` (hay presupuestos en `angular.json`).
- **Sin recursos de terceros:** los logos de tecnologías están en `public/images/technologies/`; no los cargues desde un CDN.
- **Tema:** el sitio es solo oscuro (`src/styles.css`); no dependas del modo claro/oscuro del sistema.
