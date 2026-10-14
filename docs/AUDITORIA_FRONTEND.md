# Auditoría del frontend — Portafolio CV

> **Documento histórico.** La verificación de cierre está en [AUDITORIA_FINAL_FRONTEND.md](AUDITORIA_FINAL_FRONTEND.md), que también corrige cifras de este informe (§3 de ese documento).

**Fecha:** 13 de octubre de 2026 · **Rama:** `refactor/auditoria-frontend` (sin commits nuevos: todo está en el working tree) · **Alcance:** todo el repositorio salvo `node_modules/`.

## 1. Resumen ejecutivo

El proyecto ya venía de una ronda de optimización hecha en el mismo día por otra sesión, sin commit todavía: imágenes convertidas a WebP, eliminación de los SDK de Supabase y EmailJS, eliminación de daisyUI y tema oscuro único. Esta auditoría partió de ese estado, lo midió contra el último commit (`e2ebc99`) y corrigió lo que seguía mal.

Hallazgos principales y su resultado:

1. **Crítico — fuga de información:** un documento interno de Kashio (`Guia_Reconciliacion_2_0_Actualizada FUNCIONAL Y TECNICA.docx`, con capturas sin difuminar de clientes reales, nombre de un compañero e identificadores internos) estaba **en stage en un repositorio público**; el siguiente commit lo habría publicado. Se sacó del índice y se movió a `docs/fuentes-locales/`, ignorada por Git. El archivo no se borró.
2. **Nombres que no correspondían a su contenido:** la página de contacto se llamaba `projetcsPag4`, la de proyectos `aboutMePag3` y la de inicio `HomePag2` dentro de la carpeta `AboutMePag1`. Se reorganizó en `layout/`, `pages/home|projects|contact`, `shared/` y `data/`, con nombres y selectores consistentes. Las URLs públicas no cambian.
3. **Rendimiento de la página de entrada:** con throttling real, el LCP de inicio era 3,83 s porque la foto se descubría al final de una cadena de cuatro descargas. Cargar inicio en el bundle inicial lo bajó a **2,72 s** (proyectos: 3,10 → 2,57 s). Medido y comparado con otras dos alternativas que se descartaron con datos (§8).
4. **Accesibilidad:** contraste insuficiente, puntos del carrusel de 8 px y un `aria-label` incoherente. Lighthouse Accesibilidad pasó de 92–96 a **100** en las tres páginas.
5. **Dependencia de terceros:** 12–20 peticiones por página a `cdn.jsdelivr.net` para los logos. Los logos ahora están en el proyecto: **0 dominios externos**.
6. **Pruebas:** de 1 spec trivial a **14 pruebas** (formulario, servicio de Supabase, carrusel e integridad del contenido), más 34 verificaciones funcionales en el navegador sobre el build de producción.

Frente al último commit, el cambio acumulado (las dos sesiones) deja la página de proyectos en 319 KB y LCP de 2,0 s, frente a 22 MB y 52 s. Detalle en §7.

## 2. Stack detectado

| Pieza | Versión instalada | Observación |
|---|---|---|
| Angular | 19.2.10 (CLI 19.2.11) | Standalone, builder `application` (esbuild) |
| TypeScript | 5.7.3 | `strict`, `strictTemplates` |
| Tailwind CSS | 4.1.6 (`@tailwindcss/postcss`) | daisyUI ya eliminado antes de la auditoría |
| zone.js | 0.15.0 | |
| RxJS | 7.8.2 | Solo como dependencia de Angular; el código propio no lo usa |
| Karma / Jasmine | 6.4.4 / 5.6.0 | Requiere `CHROME_BIN` en este equipo |
| sharp | 0.34.1 | Script `npm run images` |
| Supabase | API REST | Sin SDK |
| Hosting | Netlify | `_redirects`, `_headers` |

No se instaló, actualizó ni eliminó ninguna dependencia del proyecto. Las herramientas de medición (Lighthouse 12.6.1 y puppeteer-core) se instalaron fuera del repositorio.

## 3. Línea base

Se midieron dos estados:

- **HEAD** (`e2ebc99`, último commit) — extraído con `git archive` a una carpeta temporal y compilado allí.
- **Inicio** — el working tree tal como estaba al empezar la auditoría (cambios de la otra sesión incluidos).

| Comprobación | HEAD | Inicio |
|---|---|---|
| `ng build` | OK | OK |
| `ng test` | **No ejecuta**: el builder de Karma falla con la configuración PostCSS de Tailwind, y el spec esperaba un `<h1>Hello…` que ya no existía | 2/2 OK |
| Lint | No configurado | No configurado |
| JS + CSS inicial | 378,8 kB (93,5 kB comprimido) | 310,5 kB (79,8 kB) |
| Chunk de contacto | 206,9 kB (SDK de Supabase) | 50,0 kB |
| `public/` | 28 MB | 2,8 MB |

## 4. Diagnóstico

| # | Severidad | Archivo / evidencia | Impacto | Solución | Estado |
|---|---|---|---|---|---|
| C1 | **Crítico** | `src/docs/Guia_Reconciliacion…docx` en stage (`git diff --cached`); el repo `CRISTOBAL-VIZCAINO/Portafolio-CV` responde 200 sin autenticación (público) | Publicación de un documento interno de un empleador con datos de clientes | Quitar del índice, mover a `docs/fuentes-locales/` y añadirla a `.gitignore` | Hecho |
| A1 | Alto | `src/index.html`: `<link rel="canonical" href=".../">` estático en una SPA sin SSR | Las tres rutas declaraban como canónica la portada: buscadores pueden tratar proyectos y contacto como duplicados | Quitar el canonical estático | Hecho |
| A2 | Alto | `pages/AboutMePag1/HomePag2`, `ProyectsPag2/aboutMePag3`, `ContactamePag3/projetcsPag4`, `services/conectBack.service.ts`, `interfaces/requisitos.interface.ts` | Nombres de carpeta, archivo, clase y selector que describen otra página; difícil localizar código | Reorganizar por página con nombres reales | Hecho |
| A3 | Alto | LCP de inicio 3,83 s con throttling real; `lcp-discovery-insight` en Lighthouse | Página de entrada por encima de la meta de 2,5 s | Inicio en el bundle inicial (medido, §8) | Hecho |
| M1 | Medio | Lighthouse `color-contrast`: `text-gray-500` (2,8–3,9:1) y `text-gray-400` sobre `bg-gray-700` (3,96:1) | Texto difícil de leer; incumple WCAG AA | `gray-400`/`gray-300` según el fondo | Hecho |
| M2 | Medio | Lighthouse `target-size`: puntos del carrusel de 8 px | Difíciles de tocar en móvil (WCAG 2.5.8) | Botón de 24×24 px con el mismo punto visible | Hecho |
| M3 | Medio | Lighthouse `label-content-name-mismatch`: logo con `aria-label` distinto del texto visible | Usuarios de control por voz no pueden activarlo por su nombre | `aria-label` que contiene el texto visible | Hecho |
| M4 | Medio | `<footer-pages>` repetido en las tres páginas | Duplicación; cada página importa el footer | Footer en `layout/` | Hecho |
| M5 | Medio | `HomePag2`: `downloadCV()` creaba un `<a>` por código; `navigateToAboutMe()` (navegaba a proyectos) con `Router` + `scrollTo`; `@ViewChild` solo para hacer scroll | Manipulación del DOM innecesaria y nombres engañosos | `<a download>`, `<a routerLink>` y referencia de plantilla | Hecho |
| M6 | Medio | `projetcsPag4`: `FormGroup` sin tipar (`value: any`), `company: … \|\| null` contra un tipo `string \| undefined`, `ChangeDetectorRef` manual | Errores de tipo invisibles | `NonNullableFormBuilder`, tipo `string \| null` explícito, signals | Hecho |
| M7 | Medio | `fetch` a Supabase sin límite de tiempo | Con la red colgada, el botón queda en "Enviando…" para siempre | `AbortSignal.timeout(15 s)` | Hecho |
| M8 | Medio | `tech.catalog.ts`: 40 logos desde `cdn.jsdelivr.net` | 12–20 peticiones a un tercero por página; si el CDN falla, faltan los logos | Copiar los SVG de Devicon 2.16.0 al proyecto | Hecho |
| M9 | Medio | `public/` plano con 58 archivos y nombres inconsistentes (`PP-IMMG9`, `Teslop`/`Teslo`, `gifs.webp`) | Difícil saber qué imagen es de qué proyecto | `public/images/{profile,projects/<proyecto>,technologies}` con nombres `01.webp…` | Hecho |
| M10 | Medio | Documentación en `doc/` y `src/docs/`; `FRONTEND-DOCUMENTATION.md` describía el SDK de Supabase, EmailJS y un `UserService` inexistente; `arquitectura-estructura-proyecto.md` proponía guards, interceptors, autenticación y SCSS (y fechaba en "octubre 2024") | Documentación que contradice el código | Un único `docs/` con `ARQUITECTURA.md` fiel al código | Hecho |
| M11 | Medio | Solo `app.component.spec.ts` | Ninguna prueba sobre formulario, servicio o carrusel | 4 specs nuevos | Hecho |
| B1 | Bajo | Selectores `footer-pages`, `tech-icon`, `project-carousel`, `home-pag2` frente al prefijo `app` de `angular.json` | Inconsistencia | Prefijo `app-` en todos | Hecho |
| B2 | Bajo | Código muerto: `AppComponent.title`, `environment.production`, interfaz `ContactMessage` completa (solo servía para derivar otro tipo), `TECH.vite/material/flask` sin uso | Ruido | Eliminado (verificado con búsqueda y compilación estricta) | Hecho |
| B3 | Bajo | `src/app/environments/` | Fuera de la convención de Angular (`src/environments/`) | Movido | Hecho |
| B4 | Bajo | Carrusel con `@HostListener` y `document` global | Estilo distinto al resto del proyecto (`host`, `inject`) | `host` + `inject(DOCUMENT)` | Hecho |
| B5 | Bajo | `<button routerLink>` en el CTA de proyectos | Semántica de enlace incorrecta | `<a routerLink>` | Hecho |
| B6 | Bajo | `scripts/convert-to-webp.js` solo leía la raíz de `public/` | Dejaría de funcionar con carpetas | Recorre `public/images/` recursivamente (probado) | Hecho |
| B7 | Bajo | `doc/Cristobal_Vizcaino_CV_organizado.md` | Versión anterior del CV; el nuevo contiene todas sus secciones y cursos (verificado) | Eliminado (sigue en el historial de Git) | Hecho |
| O1 | Opcional | URLs `/menuNavbar/aboutMePag1…` | Poco legibles | URLs limpias + redirecciones | Propuesto (§10) |
| O2 | Opcional | No hay ESLint | Sin análisis estático más allá del compilador | Añadir `angular-eslint` | Propuesto |

## 5. Estructura

**Antes** (`src/app/`):
```
components/MenuNavbar/MenuNavbarPag1.component.*   layout
components/footerPages/footerPages.component.*
components/projectCarousel/projectCarousel.component.*
components/techIcon/techIcon.component.ts
pages/AboutMePag1/HomePag2.component.*              inicio
pages/ProyectsPag2/aboutMePag3.component.*          proyectos
pages/ContactamePag3/projetcsPag4.component.*       contacto
services/conectBack.service.ts                      solo lo usa contacto
interfaces/requisitos.interface.ts                  solo lo usa contacto
interfaces/project.interface.ts
environments/environment.ts
data/*.ts
```

**Después:**
```
src/environments/environment.ts
src/app/
├── layout/   layout.component.{ts,html}, footer.component.{ts,html}
├── pages/
│   ├── home/      home.component.{ts,html}
│   ├── projects/  projects.component.{ts,html}, project-carousel.component.{ts,html,css,spec.ts}
│   └── contact/   contact.component.{ts,html,spec.ts}, contact.service{,.spec}.ts, contact-message.ts
├── shared/   tech-icon.component.ts
└── data/     models.ts, projects.data{,.spec}.ts, skills.data.ts, tech.catalog.ts
```

Criterios aplicados: lo que usa una sola página vive en su carpeta (carrusel, servicio y tipo de contacto); `shared/` solo tiene lo que usan dos páginas; no se creó `core/` porque no hay ningún servicio global. Ninguna carpeta vacía. Mapa de responsabilidades y reglas para cambios futuros en `docs/ARQUITECTURA.md`.

## 6. Archivos

### Movidos o renombrados

| Antes | Después |
|---|---|
| `src/app/components/MenuNavbar/MenuNavbarPag1.component.{ts,html}` | `src/app/layout/layout.component.{ts,html}` |
| `src/app/components/footerPages/footerPages.component.{ts,html}` | `src/app/layout/footer.component.{ts,html}` |
| `src/app/components/projectCarousel/projectCarousel.component.{ts,html,css}` | `src/app/pages/projects/project-carousel.component.{ts,html,css}` |
| `src/app/components/techIcon/techIcon.component.ts` | `src/app/shared/tech-icon.component.ts` |
| `src/app/pages/AboutMePag1/HomePag2.component.{ts,html}` | `src/app/pages/home/home.component.{ts,html}` |
| `src/app/pages/ProyectsPag2/aboutMePag3.component.{ts,html}` | `src/app/pages/projects/projects.component.{ts,html}` |
| `src/app/pages/ContactamePag3/projetcsPag4.component.{ts,html}` | `src/app/pages/contact/contact.component.{ts,html}` |
| `src/app/services/conectBack.service.ts` | `src/app/pages/contact/contact.service.ts` |
| `src/app/interfaces/requisitos.interface.ts` | `src/app/pages/contact/contact-message.ts` |
| `src/app/interfaces/project.interface.ts` | `src/app/data/models.ts` |
| `src/app/environments/environment.ts` | `src/environments/environment.ts` (clave `anon` idéntica, verificado por hash) |
| `public/cristobal-vizcaino.webp` | `public/images/profile/cristobal-vizcaino.webp` |
| `public/{aws,bitbucket,jest}-logo.svg` | `public/images/technologies/{aws,bitbucket,jest}.svg` |
| `public/REC-IMG{1..18}.webp` | `public/images/projects/reconciliacion/01–18.webp` |
| `public/PP-IMG*.webp`, `PP-IMMG9.webp` | `public/images/projects/puropollo/01–13.webp` |
| `public/GIFS-IMG-2, GIFS-IMG-1, gifs.webp` | `public/images/projects/gif-generator/01–03.webp` |
| `public/Teslop-shop, Teslop-IMG1,2,3,5,4,6.webp` | `public/images/projects/teslo-shop/01–07.webp` |
| `public/Paises-IMG1,2,-3,4,5, paises.webp` | `public/images/projects/buscador-paises/01–06.webp` |
| `src/docs/CV_Cristobal_Vizcaino.md` | `docs/CV_Cristobal_Vizcaino.md` |
| `src/docs/Guia_Reconciliacion…docx`, `src/docs/img-originales-reconciliacion/` | `docs/fuentes-locales/` (ignorada por Git) |

Las imágenes de proyectos se numeraron en el orden del carrusel, así que el número coincide con el contador "N / total" que ve el usuario. Ninguna se recomprimió: son los mismos bytes.

### Nuevos

- `public/images/technologies/*.svg` — 40 logos de Devicon 2.16.0 (licencia MIT), 104 KB en total. Se revisó que todos sean SVG válidos y sin `<script>` ni manejadores de eventos.
- `src/app/pages/contact/contact.component.spec.ts`, `contact.service.spec.ts`, `src/app/pages/projects/project-carousel.component.spec.ts`, `src/app/data/projects.data.spec.ts`.
- `docs/ARQUITECTURA.md`, `docs/AUDITORIA_FRONTEND.md`.

### Modificados (además de las rutas de import)

`app.routes.ts` (inicio en el bundle inicial), `app.component.ts`, `layout.component.*` (footer, `aria-label`), `footer.component.*`, `home.component.*`, `projects.component.*`, `project-carousel.component.*`, `contact.component.*`, `contact.service.ts`, `contact-message.ts`, `tech-icon.component.ts`, `data/projects.data.ts`, `data/tech.catalog.ts`, `src/environments/environment.ts`, `src/index.html`, `public/_headers`, `scripts/convert-to-webp.js`, `README.md`, `.gitignore`.

### Eliminados

`src/docs/FRONTEND-DOCUMENTATION.md` y `src/docs/arquitectura-estructura-proyecto.md` (reemplazados por `docs/ARQUITECTURA.md`) y `doc/Cristobal_Vizcaino_CV_organizado.md` (versión anterior del CV). Se pueden recuperar: el CV anterior y `FRONTEND-DOCUMENTATION.md` están en el commit `e2ebc99`; `arquitectura-estructura-proyecto.md` y la última versión de `FRONTEND-DOCUMENTATION.md` están en `stash@{0}` (idénticos byte a byte a los borrados, comprobado con MD5).

## 7. Recursos estáticos

| Tipo | Inventario | Tratamiento |
|---|---|---|
| Capturas de proyectos | 47 WebP, 2,7 MB, máx. 128 KB, 1600 px de ancho | Reagrupadas por proyecto. Todas referenciadas (búsqueda en `src/` y verificación en el navegador: 47/47 responden 200 con `image/*`). |
| Foto de perfil | 1 WebP de 800×800, 42 KB | Movida. Es el LCP de inicio. |
| Logos | 43 SVG, 104 KB | 40 descargados del CDN y 3 propios. Los 43 están referenciados. |
| PDF del CV | 139 KB | Sin cambios: su URL es pública. Su contenido está desactualizado frente a `docs/CV_Cristobal_Vizcaino.md` (§10). |
| Originales PNG de Reconciliación 2.0 (difuminados) | 18 archivos, 1,5 MB | Fuera del repo, en `docs/fuentes-locales/`. No existen en el historial de Git, así que no se borraron. |

No se encontraron duplicados exactos (comparación por MD5). No hay rutas de imagen construidas dinámicamente fuera del prefijo de carpeta de `data/projects.data.ts`: cada archivo aparece escrito completo en el código.

No se generaron AVIF ni `srcset`: la imagen más pesada ocupa 128 KB y la página más pesada 319 KB en total. Con estas cifras, el beneficio no compensa duplicar los archivos y la complejidad de las plantillas.

## 8. Rendimiento

Todas las medidas se tomaron sobre builds de producción servidos localmente con gzip y fallback SPA. Lighthouse 12.6.1 en perfil móvil, con mediana de 3 corridas (5 para las comparaciones A/B).

### Lighthouse (throttling simulado, el estándar del informe de Lighthouse)

| Página | Estado | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT | Peso |
|---|---|---|---|---|---|---|---|---|---|
| Inicio | HEAD | 93 | 91 | 100 | 75 | 3,15 s | 0 | 0 ms | 2 986 KB |
| | Inicio de auditoría | 99 | 95 | 100 | 100 | 1,99 s* | 0 | 11 ms | 165 KB |
| | **Final** | **99** | **100** | **100** | **100** | **2,11 s** | **0** | **35 ms** | **164 KB** |
| Proyectos | HEAD | 74 | 91 | 100 | 75 | 52,07 s | 0 | 0 ms | 22 061 KB |
| | Inicio de auditoría | 98 | 92 | 100 | 100 | 2,14 s | 0 | 22 ms | 313 KB |
| | **Final** | **99** | **100** | **100** | **100** | **1,98 s** | **0** | **18 ms** | **319 KB** |
| Contacto | HEAD | 97 | 91 | 96 | 73 | 2,29 s | 0 | 9 ms | 167 KB |
| | Inicio de auditoría | 98 | 96 | 100 | 100 | 2,13 s | 0 | 7 ms | 153 KB |
| | **Final** | **98** | **100** | **100** | **100** | **2,14 s** | **0** | **3 ms** | **166 KB** |

\* Al repetir esa medición con 5 corridas dio 2,13 s: el simulador varía ±0,15 s entre series.

### Throttling real (`--throttling-method=devtools`, mediana de 5, variación < 0,02 s)

El simulador estima a partir de una sola carga y casi no refleja las descargas encadenadas, así que las decisiones de carga se tomaron con throttling aplicado de verdad:

| Página | Inicio de auditoría | Final | Diferencia |
|---|---|---|---|
| Inicio — FCP / LCP | 3,08 s / 3,83 s | **1,93 s / 2,72 s** | −1,15 s / −1,11 s |
| Proyectos — LCP | 3,10 s | **2,57 s** | −0,53 s |
| Contacto — LCP | 3,06 s | **2,56 s** | −0,50 s |

### Bundle

| | HEAD | Inicio de auditoría | Final |
|---|---|---|---|
| JS + CSS inicial | 378,8 kB (93,5 kB gzip) | 310,5 kB (79,8 kB) | 355,7 kB (94,6 kB) — presupuesto de aviso: 400 kB |
| Chunk diferido de contacto | 206,9 kB | 50,0 kB | 50,1 kB |
| Chunk diferido de proyectos | 35,1 kB | 18,5 kB | 18,6 kB |
| Peticiones a terceros por página | 12–20 | 12–20 | **0** |

El bundle inicial crece ~15 kB comprimidos porque ahora incluye la página de inicio y sus datos. A cambio, inicio y proyectos ahorran 1–2 descargas encadenadas, que es lo que se mide arriba.

### Alternativas medidas y descartadas

| Alternativa | Resultado | Decisión |
|---|---|---|
| Footer con `@defer (on idle)` | Inicial 319,3 kB + chunk de 6,4 kB, frente a 317,9 kB sin `@defer`; LCP igual (2,29 s en ambos) | Descartada: el runtime de `@defer` pesa más que el footer |
| `<link rel="preload">` de la foto en `index.html` | Simulado: LCP de inicio −80 ms. Real: LCP de inicio −560 ms, pero **FCP +230 ms** en inicio y en proyectos (compite con el JS) y 43 KB de más en proyectos | Descartada |
| Inicio en el bundle inicial | Ver tabla de throttling real | **Aplicada** |

**INP:** Lighthouse no mide INP en una carga sin interacción. El indicador de laboratorio, TBT, es menor de 40 ms en todas las páginas (la meta para INP es < 200 ms).

## 9. Seguridad e integraciones

- **Documento interno (C1):** corregido. `git ls-files --stage` ya no lo lista. `docs/fuentes-locales/` está en `.gitignore`, comprobado con `git check-ignore`.
- **Supabase:** la clave del frontend es de rol `anon` (decodificada del JWT) y está pensada para ser pública. `service_role` no aparece ni en el código ni en el historial (`git log -S`). Un `SELECT` anónimo con `Prefer: count=exact` devuelve `content-range: */0`. Eso es coherente con RLS activo sin política de lectura, pero no distingue ese caso de una tabla vacía: conviene confirmarlo en el panel de Supabase. Se recomienda limitar el `INSERT` anónimo a las columnas del formulario y acotar longitudes (SQL en `docs/ARQUITECTURA.md` §6). No se aplicó porque se configura en Supabase, no en el código.
- **EmailJS:** no queda ninguna referencia en el código ni en las dependencias.
- **Formulario:** los datos se envían como JSON con `fetch` y nunca se insertan como HTML. Ahora hay límite de tiempo y estados de envío y error verificados por pruebas.
- **Enlaces externos:** todos tienen `rel="noopener noreferrer"`.
- **Cabeceras (Netlify):** `X-Content-Type-Options: nosniff` y `Referrer-Policy`. No se añadió una CSP: requiere probar en Netlify las excepciones de Angular para estilos en línea y la conexión a Supabase.

## 10. Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `ng build` (producción, estricto, con presupuestos) | OK, sin advertencias |
| `ng test` (Karma, ChromeHeadless) | **14/14 OK**. Un primer fallo era un error de la propia prueba (correo con espacios, que el navegador elimina en `type="email"`); se corrigió la prueba, no el código |
| Verificación en el navegador sobre el build de producción (puppeteer, POST bloqueados para no escribir en Supabase) | **34/34 OK**: títulos de las 3 rutas, redirección de rutas desconocidas, footer único, todas las imágenes, carrusel (arrastre con mouse, rueda vertical, flechas, teclado, puntos de 24 px, vista ampliada y cierre con Escape), índice, CTA, scroll al cambiar de página, formulario (4 errores, `aria-describedby`, correo inválido), PDF del CV, tarjetas con ancla, móvil sin scroll horizontal y menú móvil. 0 errores de consola o red y 0 dominios de terceros |
| Revisión visual (capturas) | Inicio, botones convertidos en enlaces y tarjetas: sin cambios visibles |
| Lint | No configurado (no se añadió una dependencia nueva) |
| HEAD | `ng test` no ejecuta (§3) |

## 11. Pendientes y recomendaciones

1. **Hacer commit en partes:** el working tree mezcla los cambios de esta auditoría con los de otra sesión del mismo día, y el índice tiene archivos preparados por esa sesión (`README.md`, `public/_headers`, `scripts/convert-to-webp.js` y otros). Antes del commit, revisa `git status` y haz `git add -A`: los archivos movidos aparecen como borrados más nuevos sin seguimiento.
2. **Supabase:** confirma en el panel que RLS está activo y aplica la política de columnas de `docs/ARQUITECTURA.md` §6.
3. **PDF del CV:** `public/CV_Cristobal_Vizcaino.pdf` no refleja `docs/CV_Cristobal_Vizcaino.md` (no incluye Reconciliación 2.0). Regenéralo con el mismo nombre de archivo.
4. **URLs limpias** (`/`, `/proyectos`, `/contacto`) con `redirectTo` desde las actuales y `sitemap.xml` actualizado. No se hizo porque cambia URLs públicas.
5. **ESLint** (`angular-eslint`) para tener análisis estático.
6. **Zoneless:** en Angular 19 es experimental. Todos los componentes ya son `OnPush` con signals, así que la migración debería ser sencilla al actualizar a una versión donde sea estable; ahorraría unos 11 kB comprimidos.
7. **CSP** en `_headers`, después de probarla en un deploy preview de Netlify.
8. **Coherencia entre proyectos y habilidades:** hoy se revisa a mano. Si crece el contenido, conviene una prueba que compruebe que cada tecnología de `PROJECTS` aparece en `SKILL_CATEGORIES`.

## 12. Mejoras que se decidió no hacer

| Mejora | Motivo |
|---|---|
| `NgOptimizedImage` | Sin CDN ni loader de imágenes no genera `srcset`. Los atributos nativos (`loading`, `fetchpriority`, `width`/`height`) ya están aplicados |
| `@defer` en secciones de inicio | Inicio ahora va en el bundle inicial y sus imágenes ya son `lazy`. Diferir secciones arriesga que los buscadores no indexen las habilidades |
| Carpeta `core/` | No hay servicios globales: el único servicio lo usa una sola página |
| Mover Tailwind y PostCSS a `devDependencies` | Correcto en teoría, sin efecto en el bundle; se evitó tocar `package-lock.json` |
| Recomprimir o redimensionar imágenes | Todas están por debajo de 130 KB (meta: < 200 KB) |

## 13. Estado de Git y respaldos

- Rama `refactor/auditoria-frontend`, creada por la otra sesión. **Sin commits nuevos**; HEAD sigue en `e2ebc99`.
- Cambios en el índice hechos por esta auditoría: solo `git rm --cached` del documento interno y de los PNG originales de Reconciliación 2.0, que habían quedado en stage. El resto del índice se dejó como estaba.
- Respaldos: `stash@{0}` (de la otra sesión, cambios rastreados a las 21:45) y un `.tgz` completo del working tree previo a esta auditoría, en la carpeta temporal de la sesión, que **no es permanente**.
