# Arquitectura del frontend — Portafolio CV

Portafolio personal de Cristóbal Vizcaíno: 3 páginas, sin login, con un formulario de contacto que guarda los mensajes en Supabase. La arquitectura es deliberadamente pequeña: cada carpeta existe porque hoy tiene contenido y una responsabilidad clara.

> Este documento reemplaza a `src/docs/arquitectura-estructura-proyecto.md` (proponía guards, interceptors, autenticación y SCSS que el proyecto no tiene) y a `src/docs/FRONTEND-DOCUMENTATION.md` (describía el SDK de Supabase, EmailJS y daisyUI, que ya no se usan). Se pueden recuperar: `FRONTEND-DOCUMENTATION.md` está en el commit `e2ebc99` y ambos en `stash@{0}`.

## 1. Stack

| Pieza | Versión | Uso |
|---|---|---|
| Angular (standalone, `OnPush`, signals) | 19.2 | Framework. Builder `application` (esbuild). |
| TypeScript | 5.7 | `strict` + `strictTemplates`. |
| Tailwind CSS (vía `@tailwindcss/postcss`) | 4.1 | Único sistema de estilos. Sin daisyUI ni Bootstrap. |
| zone.js | 0.15 | Detección de cambios (zoneless queda como mejora futura, ver `AUDITORIA_FINAL_FRONTEND.md` §11). |
| Supabase (API REST, sin SDK) | — | Tabla `contact_messages` para el formulario. |
| Karma + Jasmine | 6.4 / 5.6 | Pruebas unitarias (`npm test`). |
| sharp | 0.34 | Solo en desarrollo: `npm run images` convierte a WebP. |
| Netlify | — | Hosting estático (`_redirects`, `_headers`). |

## 2. Estructura

```
Portafolio-CV/
├── .cursor/rules/*.mdc           Reglas para asistentes de IA (resumen operativo de este documento, ver §10)
├── docs/                         Documentación (no se compila)
│   ├── ARQUITECTURA.md           Este documento (fuente de verdad)
│   ├── AUDITORIA_FINAL_FRONTEND.md  Estado verificado, pendientes y recomendaciones (oct. 2026)
│   ├── AUDITORIA_FRONTEND.md     Informe histórico de la primera auditoría
│   ├── AUDITORIA_RESPONSIVE.md   Auditoría responsive (matriz de dispositivos, defectos y pruebas)
│   ├── evidencias/responsive/    Capturas seleccionadas de esa auditoría
│   ├── CV_Cristobal_Vizcaino.md  Fuente del CV
│   └── fuentes-locales/          (en .gitignore) documentos internos y originales de imágenes
├── public/                       Se copia tal cual a la raíz del sitio
│   ├── images/
│   │   ├── profile/              Foto de perfil
│   │   ├── projects/<proyecto>/  Capturas WebP numeradas 01, 02… en el orden del carrusel
│   │   └── technologies/         Logos SVG de tecnologías (Devicon 2.16.0, MIT, + 3 propios)
│   ├── CV_Cristobal_Vizcaino.pdf URL pública estable: no la renombres
│   ├── favicon.png, 404.html     404.html: respuesta de imágenes inexistentes (ver §9)
│   ├── robots.txt, sitemap.xml
│   └── _redirects, _headers      Configuración de Netlify
├── scripts/convert-to-webp.js    npm run images
└── src/
    ├── environments/environment.ts   URL y clave pública (anon) de Supabase
    ├── index.html, main.ts, styles.css
    └── app/
        ├── app.component.ts, app.config.ts, app.routes.ts
        ├── layout/               Estructura común: navbar + <router-outlet> + footer
        │   ├── layout.component.{ts,html}
        │   └── footer.component.{ts,html}
        ├── pages/                Una carpeta por ruta
        │   ├── home/             "Acerca de mí": presentación, habilidades, vista previa de proyectos
        │   ├── projects/         "Mis Proyectos" + su carrusel (solo lo usa esta página)
        │   └── contact/          Formulario + ContactService + tipo del mensaje (solo los usa esta página)
        ├── shared/
        │   ├── tech-icon.component.ts   Logo de tecnología (lo usan home y projects)
        │   └── motion.ts                Desplazamiento suave salvo "reducir movimiento" (home, projects, carrusel)
        └── data/                 Contenido tipado, sin lógica de UI
            ├── models.ts         Tipos: Project, ProjectImage, TechItem, SkillCategory…
            ├── projects.data.ts  Proyectos y experiencia
            ├── skills.data.ts    Habilidades de "Acerca de mí"
            └── tech.catalog.ts   Catálogo único de tecnologías (logo + nombre)
```

### Dónde va cada cosa

| Si necesitas… | Va en… | Regla |
|---|---|---|
| Una página nueva | `pages/<nombre>/` + entrada en `app.routes.ts` con `loadComponent` | Una carpeta por ruta; en diferido salvo que sea la página de entrada. |
| Un componente que solo usa una página | La carpeta de esa página | No lo subas a `shared/` "por si acaso". |
| Un componente que usan 2+ páginas | `shared/` | Solo cuando el segundo uso exista de verdad. |
| Un servicio o tipo que solo usa una página | La carpeta de esa página (ej. `pages/contact/contact.service.ts`) | Pasa a `core/` solo si lo comparten varias páginas o es global (hoy no hay ninguno, por eso no existe `core/`). |
| Texto, proyectos, habilidades, tecnologías | `data/` | Se edita sin tocar HTML. |
| Algo visible en todas las páginas | `layout/` | Navbar y footer ya viven ahí. |
| Configuración pública (URLs, claves públicas) | `src/environments/environment.ts` | Nunca secretos: el archivo llega al navegador. |
| Imágenes | `public/images/...` (WebP) | Ver §5. |
| Documentos | `docs/` | `src/` es solo código que se compila. Ver §10. |

## 3. Convenciones

- **Archivos:** `kebab-case` con sufijo de tipo — `project-carousel.component.ts`, `contact.service.ts`. Plantilla en `.html` aparte cuando supera unas 20 líneas; si es corta, `template` inline (como `tech-icon`).
- **Clases y selectores:** `ProjectsComponent` ↔ `app-projects`. Todos los selectores usan el prefijo `app-` (`angular.json → prefix`).
- **Páginas:** `export default class` para que `loadComponent: () => import(...)` no necesite `.then()`.
- **Componentes:** `standalone` (por defecto en Angular 19), `ChangeDetectionStrategy.OnPush`, estado con `signal`/`computed`, entradas con `input()`, dependencias con `inject()`, eventos globales con `host: { '(document:...)': ... }` en vez de `@HostListener`.
- **Formularios:** reactivos y tipados (`NonNullableFormBuilder`), sin `any`.
- **Estilos:** utilidades de Tailwind en la plantilla; CSS de componente solo para lo que Tailwind no cubre (el carrusel). Tema único oscuro definido en `src/styles.css`.
- **Contraste:** sobre fondos oscuros, texto secundario como mínimo `text-gray-400` (`text-gray-300` sobre `bg-gray-700`). `text-gray-500` no llega a 4.5:1.
- **Nombres accesibles:** si un control tiene texto visible y `aria-label`, el `aria-label` debe contener ese texto ("Ampliar" → `aria-label="Ampliar imagen"`).
- **Responsive:** diseño mobile-first con los breakpoints de Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). El menú de escritorio aparece desde `lg`: por debajo no cabe junto al nombre (medido). Hijos de rejillas y flex que contienen texto llevan `min-w-0`; nada de anchos fijos en px para texto; textos sin espacios (correos, URLs) con `wrap-anywhere`; nunca `overflow-x: hidden` para ocultar un desborde. `src/styles.css` aplica `overflow-wrap: anywhere` a títulos, párrafos y listas (solo actúa si una palabra no cabe). Verificación y matriz de dispositivos en `AUDITORIA_RESPONSIVE.md`.
- **Movimiento:** `src/styles.css` anula transiciones y animaciones con `prefers-reduced-motion: reduce`; para desplazar por código usa `scrollBehavior()` de `shared/motion.ts`, nunca `behavior: 'smooth'` fijo.

## 4. Rutas

| URL | Componente | Notas |
|---|---|---|
| `/` | `pages/home` | Inicio ("Acerca de mí"). Las tarjetas enlazan a `/proyectos#<id-del-proyecto>`. |
| `/proyectos` | `pages/projects` | `#id` lleva al proyecto (`withInMemoryScrolling`, `anchorScrolling`). |
| `/contacto` | `pages/contact` | |
| cualquier otra | redirige a inicio | |

**URLs anteriores (hasta octubre de 2026).** `/menuNavbar/aboutMePag1`, `/menuNavbar/proyectsPag2` y `/menuNavbar/contactPag3` siguen en el CV en PDF y en enlaces externos, así que redirigen a las nuevas en dos niveles:
- **Netlify** (`public/_redirects`): 301 permanente, para que los buscadores trasladen el posicionamiento. El navegador conserva el ancla (`#proyecto`).
- **Router** (`LEGACY_REDIRECTS` en `app.routes.ts`): respaldo para el servidor de desarrollo u otro hosting; también conserva el ancla.

No quites esas redirecciones: `app.routes.spec.ts` comprueba cada una. Si cambias una URL pública, añade su redirección en ambos sitios y actualiza `sitemap.xml`.

`layout` e inicio se importan directamente en `app.routes.ts` (bundle inicial); proyectos y contacto se cargan con `loadComponent`. Inicio es la página de entrada: en diferido, la foto (su LCP) esperaba dos descargas encadenadas más. Medido con Lighthouse y throttling real: LCP de inicio 3,87 s → 2,72 s, de proyectos 3,10 s → 2,57 s, a cambio de ~12 kB comprimidos más en el bundle inicial.

## 5. Contenido e imágenes

**Añadir un proyecto:** agrega un objeto a `PROJECTS` en `data/projects.data.ts`. La página de proyectos, la vista previa de inicio y el índice se generan solos. El `id` es el ancla de la URL: minúsculas y guiones, único (lo verifica `projects.data.spec.ts`).

**Añadir capturas:**
1. Copia los PNG/JPG a `public/images/projects/<proyecto>/` con nombres `01.png`, `02.png`… en el orden del carrusel.
2. `npm run images` → genera `01.webp`… (máx. 1600 px de ancho, calidad 80). Una captura debe pesar ~30–130 KB.
3. Referéncialas en `data/projects.data.ts` como `'<proyecto>/01.webp'`. Las rutas se escriben completas en el código (sin construirlas con bucles) para que una búsqueda de texto encuentre cada uso.
4. Guarda el original fuera del repo (por ejemplo en `docs/fuentes-locales/`) y borra el PNG de `public/`.
5. Si la captura muestra nombres de clientes, compañeros o identificadores internos, difumínalos antes: el repositorio es público.

**Añadir una tecnología:** agrégala a `TECH` en `data/tech.catalog.ts`. Si tiene logo en Devicon 2.16.0, descarga `icons/<nombre>/<nombre>-original.svg` a `public/images/technologies/<nombre>.svg` y usa `dev('<nombre>')`; si no, usa un `glyph` genérico. Si un proyecto la usa, añádela también a `data/skills.data.ts` para que "Acerca de mí" siga alineado con los proyectos.

## 6. Formulario de contacto y Supabase

`ContactComponent` valida en el navegador y llama a `ContactService.sendMessage()`, que hace un `POST` a `https://<proyecto>.supabase.co/rest/v1/contact_messages` con la clave pública `anon` (sin SDK, ~200 kB menos). Si no hay respuesta en 15 s, la petición se cancela y el usuario ve el mensaje de error. Mientras envía ignora nuevos envíos; con errores lleva el foco al primer campo inválido; cada campo tiene longitud máxima (`MAX_LENGTH`, mismas cifras que la política SQL de abajo).

`Prefer: return=minimal` es necesario: RLS no deja a `anon` leer filas, y pedir la fila insertada (`return=representation`) añade un `RETURNING` que según el comportamiento documentado de PostgREST con RLS haría fallar el `INSERT` (no se probó para no escribir en producción).

**Seguridad:**
- La clave `anon` es pública por diseño. La protección la da **RLS** en la tabla. Nunca pongas la clave `service_role` en el frontend.
- Comprobado contra el servicio real sin escribir filas (octubre 2026): las 6 columnas del formulario existen; `anon` tiene permiso de `INSERT` sobre ellas; un `SELECT` anónimo devuelve 0 filas. La descripción OpenAPI (`GET /rest/v1/`) solo responde a `service_role`, así que el esquema completo no se puede leer con la clave pública.
- **Pendiente (requiere acceso al panel):** `anon` también puede escribir la columna `status` (comprobado con un `INSERT` de 0 filas sobre esa columna). Aplica la política siguiente para limitar el `INSERT` anónimo a las columnas del formulario y acotar longitudes. Un honeypot en el formulario no protegería nada: el endpoint es público y un bot puede llamarlo directamente.

```sql
alter table public.contact_messages enable row level security;

create policy "Inserción anónima desde el formulario"
  on public.contact_messages for insert to anon
  with check (
    char_length(full_name) between 1 and 120 and
    char_length(email)     between 3 and 254 and
    char_length(subject)   between 1 and 200 and
    char_length(message)   between 1 and 5000 and
    coalesce(char_length(company), 0) <= 120 and
    coalesce(char_length(phone), 0)   <= 40
  );

revoke insert on public.contact_messages from anon;
grant insert (full_name, email, company, phone, subject, message) on public.contact_messages to anon;
```

Tabla de referencia (creada en el proyecto `portafolioBackend`, región `us-east-1`):

```sql
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  public_id  text not null unique default ('MSG-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  full_name  text not null,
  email      text not null,
  company    text,
  phone      text,
  subject    text not null,
  message    text not null,
  status     text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 7. Rendimiento

Metas, medidas sobre el build de producción (`npm run build` y servir `dist/portafolio-cjvm/browser`, nunca `ng serve`) con Lighthouse en perfil móvil:

| Métrica | Meta | Estado (oct. 2026) |
|---|---|---|
| LCP | < 2,5 s | 1,9–2,1 s (simulado); 2,57–2,73 s con throttling real (inicio supera la meta, ver AUDITORIA_FINAL_FRONTEND.md) |
| CLS | < 0,1 | 0 |
| TBT (aproximación de laboratorio a INP < 200 ms) | < 200 ms | < 40 ms |
| JS + CSS inicial (bruto; el presupuesto mide bruto) | < 400 kB (aviso) / 600 kB (error) en `angular.json` | 356,3 kB (≈ 94,9 kB gzip estimado por el CLI) |
| Imagen individual | < 200 KB | máx. 128 KB |

Reglas:
- Imágenes que no estén en la primera pantalla: `loading="lazy"`. La foto de perfil de inicio es el LCP: lleva `fetchpriority="high"`, `width` y `height`.
- Antes de añadir una dependencia, compara `Initial total` de `npm run build` antes y después.
- Nada de recursos de terceros en tiempo de ejecución: hoy el sitio no contacta ningún dominio externo (solo Supabase al enviar el formulario).

## 8. Pruebas y verificación

- `npm test` (Karma; en Linux sin Chrome por defecto: `CHROME_BIN=/usr/bin/google-chrome-stable npx ng test --watch=false --browsers=ChromeHeadless`). 26 pruebas. Cubren: `AppComponent`; rutas (las 3 URLs, cada redirección antigua con su ancla y rutas desconocidas); formulario de contacto (validación, normalización, errores, doble envío, foco al primer error, longitudes máximas); `ContactService` (petición, cabeceras y errores HTTP); carrusel (navegación, vista ampliada, scroll de la página) e integridad de `PROJECTS` (ids únicos, rutas de imágenes, textos alternativos).
- `npm run build`: compila en modo estricto y aplica los presupuestos.
- No hay ESLint configurado (ver recomendaciones en `AUDITORIA_FINAL_FRONTEND.md` §11).

## 9. Despliegue (Netlify)

- `public/_redirects`: 301 de las URLs antiguas `/menuNavbar/...` a `/`, `/proyectos` y `/contacto` (§4); `/images/* /404.html 404` (imagen inexistente → 404 real); y al final `/* /index.html 200` (SPA). Netlify sirve primero los archivos que existen (shadowing) y aplica la primera regla que coincide. Limitación: `_redirects` no admite `/*.js`, así que un JS inexistente sigue recibiendo `index.html`.
- `public/_headers`: JS/CSS con hash → caché inmutable de 1 año; `/images/*` y favicon → 1 día con `stale-while-revalidate`.
- `robots.txt` y `sitemap.xml` con las 3 URLs públicas (`/`, `/proyectos`, `/contacto`).

## 10. Documentación y reglas para asistentes de IA

| Archivo | Contenido | Cuándo se actualiza |
|---|---|---|
| `README.md` | Qué es el proyecto, comandos y estructura resumida | Al cambiar comandos, carpetas principales o el stack |
| `docs/ARQUITECTURA.md` | Este documento: **fuente de verdad** | En el mismo cambio que el código que describe |
| `docs/AUDITORIA_FINAL_FRONTEND.md` | Estado verificado, pendientes y recomendaciones | Al cerrar un pendiente o con una nueva auditoría |
| `docs/AUDITORIA_FRONTEND.md` | Primera auditoría (histórico) | No se edita |
| `docs/AUDITORIA_RESPONSIVE.md` + `docs/evidencias/responsive/` | Matriz de dispositivos, defectos corregidos, pruebas y capturas | Al cambiar el layout de forma visible o repetir la auditoría responsive |
| `docs/CV_Cristobal_Vizcaino.md` | Fuente del CV | Al cambiar la experiencia; regenera también `public/CV_Cristobal_Vizcaino.pdf` |
| `.cursor/rules/*.mdc` | Resumen operativo para Cursor | En el mismo cambio que este documento |

Reglas de Cursor (`.cursor/rules/`, formato `.mdc` con `description`, `globs` y `alwaysApply`):

| Regla | Se aplica | Cubre |
|---|---|---|
| `00-proyecto.mdc` | Siempre | Estructura, comandos y reglas que no se rompen (repo público, URLs estables, sin CDN ni dependencias sin medir) |
| `angular-componentes.mdc` | `src/app/**/*.{ts,html,css}`, `src/styles.css` | §3: convenciones de Angular, estilos y accesibilidad |
| `contenido-e-imagenes.mdc` | `src/app/data/**`, `public/images/**`, script de imágenes | §5: proyectos, habilidades, tecnologías e imágenes |
| `contacto-supabase.mdc` | `src/app/pages/contact/**`, `src/environments/**` | §6: formulario y Supabase |
| `pruebas.mdc` | `src/**/*.spec.ts` | §7–§8: pruebas y verificación |
| `documentacion.mdc` | `**/*.md`, `.cursor/rules/*.mdc` | Esta sección: qué documento cubre qué y cómo mantenerlos alineados |

Las reglas resumen este documento y lo referencian con `@docs/ARQUITECTURA.md`; si discrepan, manda este documento y se corrigen ambos en el mismo cambio.
