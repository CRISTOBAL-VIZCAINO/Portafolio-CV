# Auditoría final de cierre — Portafolio CV

**Fecha:** 13 de octubre de 2026 · **Rama:** `refactor/auditoria-frontend` · **HEAD:** `e2ebc99` (sin commits, push ni despliegue en esta auditoría) · **Base:** [AUDITORIA_FRONTEND.md](AUDITORIA_FRONTEND.md), usado como lista de comprobación; cada afirmación se volvió a verificar contra el código y el comportamiento actuales.

## 1. Estado general y conclusión

### Conclusión: **APROBADO CON PENDIENTES**

El frontend compila, pasa todas las pruebas y funciona en las tres rutas. Los defectos que quedaban y se podían corregir con seguridad están corregidos y verificados. Lo pendiente depende de accesos o decisiones fuera del código:

1. **Envío real del formulario en producción (no verificable desde aquí).** La petición se validó contra el Supabase real **sin escribir ninguna fila**: las columnas existen, `anon` tiene permiso de `INSERT` y las cabeceras son correctas. Que la política RLS acepte una fila real solo se demuestra insertándola, y eso requiere tu autorización. El código hace la misma petición que hacía `supabase-js` antes de quitar el SDK.
2. **Permisos de Supabase (riesgo medio, configuración remota).** `anon` puede escribir la columna `status`. La corrección (SQL en `ARQUITECTURA.md` §6) se aplica en el panel de Supabase, no en el frontend.
3. **LCP de inicio con throttling real: 2,73 s**, 0,23 s por encima de la meta de 2,5 s. Con el throttling simulado estándar de Lighthouse queda en 2,03 s. La mejora de fondo (prerenderizar) es un cambio de arquitectura que necesita tu aprobación (§11).

**Por qué no "APROBADO":** quedan una verificación externa (punto 1) y un ajuste de seguridad remoto (punto 2) sin cerrar, y la meta de LCP no se cumple en la medición más exigente.

**Por qué no "NO APROBADO":** no hay fallos funcionales ni de compilación conocidos, no hay secretos expuestos y el documento interno no está en el índice. El código del formulario está verificado de punta a punta: con pruebas unitarias, contra un servidor simulado en el navegador y contra el esquema y los permisos reales.

Evidencias principales:

- `ng build` sin advertencias.
- 17/17 pruebas unitarias.
- `tsc` sin errores.
- 43/43 verificaciones de auditoría en el navegador, con axe-core sin violaciones en 8 estados.
- 34/34 verificaciones funcionales.
- Lighthouse 98–99 en rendimiento y 100 en accesibilidad, buenas prácticas y SEO en las 3 páginas.
- 0 dominios de terceros.
- Texto de las 3 páginas idéntico al previo a las auditorías.

## 2. Tabla de verificación

Leyenda: **VERIFICADO**, **PENDIENTE**, **FALLIDO** (problema comprobado; si se corrigió en esta auditoría, se indica "→ corregido"), **NO VERIFICABLE**, **NO APLICA**.

### A. Imágenes y rendimiento

| Punto | Estado | Evidencia |
|---|---|---|
| Los WebP existen y se ven | VERIFICADO | 47 capturas + foto responden 200 `image/*` en el navegador (e2e); revisión visual |
| Sin referencias rotas | VERIFICADO | e2e: 0 imágenes rotas en las 3 páginas; `projects.data.spec.ts` valida el formato de rutas; búsqueda de nombres antiguos: 0 resultados en código |
| Contenido, legibilidad y calidad | VERIFICADO | SSIM frente al original redimensionado: media 0,990, peor 0,976 (`puropollo/09`); recortes al 100 % comparados a simple vista sin diferencias |
| Nombres y rutas coinciden | VERIFICADO | Cada archivo de `public/images` está referenciado y cada referencia existe |
| No se descargan imágenes que no se muestran | VERIFICADO | Al recorrer la página de proyectos sin tocar los carruseles se descargan 10 de 47 capturas en escritorio y 15 en móvil (la visible y 1–2 siguientes por carrusel), no las 47 |
| `loading="lazy"` en carruseles; prioridad de la imagen principal | VERIFICADO | Diapositivas y portadas `lazy`; foto de inicio con `fetchpriority="high"`, `width`/`height` |
| `width`/`height`/`srcset`/`sizes` | VERIFICADO / recomendación | Sin CLS (0 en todas las páginas): los contenedores tienen proporción fija. `srcset` 800w medido: móvil de densidad ≤ 2 ahorraría 668 KB (−62 %) al recorrer proyectos; en densidad 3 no ahorra. No se aplicó (§11) |
| Originales en documentación no se sirven | VERIFICADO | Están en `docs/fuentes-locales/` (ignorada por Git y fuera de `public/`); `dist/` no contiene `.md`, `.docx` ni esa carpeta |
| `npm run images` funciona y no sobrescribe | VERIFICADO → corregido detalle | Crea WebP; sin `--force` no toca un WebP existente (mismo mtime); con `--force` regenera; ninguna otra imagen modificada. Se corrigió el signo del porcentaje cuando el WebP pesa más (`--259%` → `+259%`) |
| Cifras "25,7 MB → 2,63 MB, −90 %" | FALLIDO (cifra) → corregido | No aparecen en ningún archivo del repo (venían de otra sesión). Ver §7 |

### B. Bundle y compilación

| Punto | Estado | Evidencia |
|---|---|---|
| Compila en producción | VERIFICADO | `ng build`: sin errores ni advertencias |
| Los presupuestos funcionan | VERIFICADO | Copia temporal con presupuesto de 300 kB: el build falla con código 1 (`bundle initial exceeded maximum budget`) |
| Inicial dentro de límites | VERIFICADO | 356,24 kB bruto (aviso a 400 kB, error a 600 kB; el presupuesto mide tamaño bruto) |
| Chunks diferidos | VERIFICADO | `contact-component` 50,77 kB, `projects-component` 18,56 kB; inicio va en el bundle inicial a propósito (§7) |
| Dependencias innecesarias o duplicadas | VERIFICADO | `npm ls` sin extraneous/missing/invalid; `package.json` = raíz del lockfile; sin restos de daisyUI, Supabase SDK ni EmailJS; cada dependencia tiene uso (tabla en §3) |
| `dist/` sin documentos | VERIFICADO | Solo JS/CSS con hash, `index.html`, `404.html`, imágenes, PDF del CV, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`, favicon |
| Coherencia con las versiones | VERIFICADO | Angular 19.2.10 / CLI 19.2.11 / TS 5.7.3; `tsc` sin errores en app y specs |

### C. Contacto y Supabase

| Punto | Estado | Evidencia |
|---|---|---|
| 1. URL, endpoint y cabeceras | VERIFICADO (real, sin escritura) | `POST /rest/v1/contact_messages` con `apikey`, `Authorization: Bearer`, `Content-Type: application/json`; `INSERT` de 0 filas sobre las 6 columnas → **201** |
| 2. Cuerpo acorde al esquema real | VERIFICADO (real, sin escritura) | Cuerpo con las 6 columnas + columna ficticia → PostgREST nombra solo la ficticia (`PGRST204`), así que las 6 existen. Control: un nombre mal escrito sí se detecta. El esquema completo (tipos, `NOT NULL`) no se puede leer: OpenAPI exige `service_role` |
| 3. Respuesta HTTP, carga, éxito, errores, red | VERIFICADO (simulado) | Navegador con Supabase simulado (CORS incluido): 201 → éxito y formulario vacío; 500 → error y se conserva lo escrito; red caída → error; botón con "Enviando…" y reactivado tras el error. Unitarias: `!response.ok` lanza; timeout de 15 s |
| 4. Envíos repetidos; nunca éxito ante fallo | FALLIDO (parcial) → corregido | Solo el botón deshabilitado impedía el doble envío. Se añadió una guarda en `onSubmit`. Navegador: doble clic + Enter → **1** petición. Unitaria nueva |
| 5. `Prefer: return=minimal` | VERIFICADO | Presente. Es el adecuado: RLS no deja leer filas a `anon` |
| 6. `anon` tratada como pública | VERIFICADO | Rol `anon` decodificado del JWT; documentado en `environment.ts` |
| 7. Sin credenciales privadas | VERIFICADO | `service_role` no aparece en código, bundle ni historial (`git log -S`) |
| 8. RLS documentada y verificable | PENDIENTE (externo) | SQL documentado. Sin escribir: `SELECT` anónimo → 0 filas; `INSERT` permitido en las columnas del formulario. Que la política acepte una fila real: **no verificado** (requiere autorización) |
| 9. Spam y abuso | PENDIENTE (externo) → mitigado en el frontend | Añadidas longitudes máximas por campo. **Hallazgo:** `anon` puede escribir `status` (`INSERT` de 0 filas sobre esa columna → 201). Sin límite de frecuencia ni CAPTCHA. Un honeypot no serviría: el endpoint REST es público |
| Prueba real del formulario | NO VERIFICABLE | No hay entorno de pruebas y escribir en producción requiere autorización |

### D. Navegación y componentes

| Punto | Estado | Evidencia |
|---|---|---|
| Rutas al navegar y al recargar | VERIFICADO | e2e + recarga directa de `/proyectsPag2#gif-generator` (llega a la sección) y `/contactPag3`; ruta desconocida → inicio |
| Enlaces internos con `routerLink` | VERIFICADO | Navbar, footer, tarjetas y CTA; navegación sin recarga (`performance` con 1 navegación tras 4 clics) |
| Enlaces externos con `rel` | VERIFICADO | Todos los `target="_blank"` llevan `rel="noopener noreferrer"` |
| Menú móvil: abrir, cerrar, Escape, clic fuera | VERIFICADO → corregido detalle | Funcionaba; al cerrar con Escape el foco se perdía. Ahora vuelve al botón (verificado) |
| Nombres accesibles | FALLIDO → corregido | axe (escritorio): el botón "Ampliar" tenía `aria-label="Ver imagen en grande"` (WCAG 2.5.3). Ahora `"Ampliar imagen"` |
| Layout sin recargas innecesarias | VERIFICADO | Layout y footer persisten entre rutas (sin recarga, 1 entrada de navegación) |
| Código muerto | FALLIDO (menor) → corregido | El ícono genérico `bolt` (tipo `TechGlyph` y `GLYPH_PATHS`) no lo usaba ninguna tecnología: eliminado. `code` se conserva porque es el valor por defecto de `tech-icon`. Sin imports ni métodos sin uso (compilación estricta) |
| Datos desde `data/` | VERIFICADO | Inicio y proyectos se generan de `PROJECTS`/`SKILL_CATEGORIES` |
| Sin pérdida de contenido | VERIFICADO | Texto visible completo de las 3 páginas idéntico al del working tree previo a las auditorías (7 651 / 9 806 / 1 009 caracteres) |

### E. Accesibilidad

| Punto | Estado | Evidencia |
|---|---|---|
| Contraste WCAG AA | VERIFICADO | axe 0 violaciones en 8 estados; Lighthouse 100. Los grises y las pastillas señalados antes ya estaban corregidos |
| Foco visible y teclado | VERIFICADO | Recorrido con Tab: 20 / 40 / 22 elementos con indicador de foco visible; carrusel con flechas, Enter y Escape |
| Etiquetas de campos | VERIFICADO | `label for` ↔ `id` en los 6 campos; errores con `aria-describedby` |
| Mensajes anunciables | VERIFICADO → mejorado | Éxito y error en `role="status"`. Nuevo: al enviar con errores, el foco va al primer campo inválido |
| Encabezados y semántica | VERIFICADO | 1 `h1` por página, sin saltos de nivel; `header`/`main`/`nav`/`footer` correctos (el footer ahora está fuera de `main` y se expone como `contentinfo`) |
| Objetivos táctiles | VERIFICADO | Puntos del carrusel de 24×24 px |
| Texto alternativo | VERIFICADO | Capturas con `alt` descriptivo; logos decorativos con `alt=""` junto a su nombre |
| Movimiento reducido | FALLIDO → corregido | No se respetaba. Ahora: CSS global para transiciones y animaciones, y `shared/motion.ts` para los desplazamientos por JavaScript. Verificado con `prefers-reduced-motion: reduce`: transición de 1e-05 s y salto del carrusel sin animación |

### F. SEO y recursos públicos

| Punto | Estado | Evidencia |
|---|---|---|
| `lang="es"` | VERIFICADO | |
| Títulos por ruta | VERIFICADO | "Acerca de mí / Proyectos / Contacto \| Cristóbal Vizcaíno" |
| Descripción y Open Graph | VERIFICADO / recomendación | `description`, `og:title`, `og:description`, `og:url`, `og:locale` presentes (comunes a todas las rutas). Falta `og:image` (§11) |
| Canonical y dominio | VERIFICADO | Dominio confirmado: el autor lo commiteó el 8 de mayo de 2026 (`cdae0bc`) en su CV y el sitio publicado en esa URL es este portafolio (GET de solo lectura). No hay `canonical` estático (era incorrecto en una SPA) |
| `robots.txt` y `sitemap.xml` | VERIFICADO | Existen; el sitemap lista las 3 rutas válidas (200 en local) |
| Favicon | VERIFICADO | `favicon.png` carga |
| Netlify no devuelve `index.html` para recursos inexistentes | FALLIDO → corregido (verificación estática) | En producción, `/robots.txt`, `/sitemap.xml` y `/images/...` (aún no desplegados) responden 200 con `index.html`. Añadido `/images/* /404.html 404` antes de la regla SPA, con la sintaxis de la documentación de Netlify. Limitación: `_redirects` no admite `/*.js` |
| Reglas de caché de `_headers` | VERIFICADO (estático) | `/*.js` y `/*.css` válidos según la documentación (comodín dentro de un segmento) y coinciden con los archivos con hash; `/images/*` cubre subcarpetas |

### G. Tailwind, estilos y dependencias

| Punto | Estado | Evidencia |
|---|---|---|
| Configuración acorde a Tailwind 4 | VERIFICADO | `@import "tailwindcss" source(none)` + `@source "./app"` + `@source "./index.html"`; PostCSS con `@tailwindcss/postcss` |
| Ninguna clase sin generar | VERIFICADO | 381 clases usadas en plantillas, `[class]` y `host` → todas presentes en el CSS generado |
| daisyUI eliminado | VERIFICADO | Ni en `package.json`, ni en el lockfile, ni en CSS o plantillas |
| `package.json` ↔ lockfile | VERIFICADO | Idénticos en dependencies y devDependencies |
| Cada dependencia justificada | VERIFICADO | §3 |
| Tema y responsive | VERIFICADO | Tema oscuro único; móvil sin scroll horizontal en las 3 páginas; capturas revisadas |

### H. Netlify y despliegue

| Punto | Estado | Evidencia |
|---|---|---|
| Compatible con una SPA | VERIFICADO (estático) | Regla `/* /index.html 200` al final; los archivos reales se sirven primero (shadowing) |
| Caché de recursos con hash e imágenes | VERIFICADO (estático) | JS/CSS inmutables 1 año; imágenes y favicon 1 día con `stale-while-revalidate` |
| Ubicación de robots, sitemap y favicon | VERIFICADO | En la raíz de `dist/portafolio-cjvm/browser` |
| Comportamiento en Netlify | NO VERIFICABLE | Sin despliegue ni Netlify CLI; no hay `netlify.toml` (el directorio de publicación se configura en el panel: debe ser `dist/portafolio-cjvm/browser`) |

### I. Documentación y archivos

| Punto | Estado | Evidencia |
|---|---|---|
| `README.md` | VERIFICADO → actualizado | Estructura con `shared/motion.ts` y enlace a este informe |
| `FRONTEND-DOCUMENTATION.md`, `src/docs/`, `doc/` | NO APLICA (ya resuelto) | Reemplazados por `docs/ARQUITECTURA.md` en la auditoría anterior; recuperables desde `e2ebc99` y `stash@{0}` (MD5 idéntico) |
| `ARQUITECTURA.md` | VERIFICADO → actualizado | 404 en Netlify, `motion.ts`, límites del formulario, hallazgos de Supabase, cifras de rendimiento |
| `src/docs/img-originales-reconciliacion/` y DOCX | VERIFICADO | Ya no están en `src/` sino en `docs/fuentes-locales/` (ignorada por Git). No se borraron: los PNG difuminados no existen en el historial y el DOCX es un documento interno de un tercero que no debe publicarse |
| Worktree `/tmp/headwt` | VERIFICADO → retirado | Existía y estaba en `e2ebc99`, sin cambios en archivos rastreados (solo `dist/`, `.angular/` y un symlink a `node_modules`, ignorados), creado para la línea base. Se quitó primero el symlink y luego se usó `git worktree remove`, sin `--force`. `node_modules` del proyecto intacto (566 entradas antes y después) |

## 3. Evidencia de los problemas encontrados y correcciones al informe anterior

**Problemas nuevos (todos corregidos salvo los externos):**

1. **Nombre accesible del botón "Ampliar".** axe (escritorio): `label-content-name-mismatch` en 5 nodos. Lighthouse no lo detectaba porque usa viewport móvil, donde el texto "Ampliar" está oculto (`hidden sm:inline`).
2. **Movimiento reducido.** Las transiciones y los `scrollIntoView`/`scrollTo` con `behavior: 'smooth'` fijo no consultaban `prefers-reduced-motion`.
3. **Doble envío.** Dependía solo de `[disabled]`; `onSubmit()` no tenía guarda.
4. **Soft 404 en Netlify.** `curl` a producción: `/images/profile/cristobal-vizcaino.webp` → `200 text/html`.
5. **Foco tras cerrar el menú con Escape.** Quedaba en `body`.
6. **Sin longitudes máximas en el formulario.**
7. **Supabase (externo):** `anon` puede insertar en `status`; sin límite de frecuencia.

**Correcciones al informe anterior:**

| Afirmación anterior | Valor verificado |
|---|---|
| "47 capturas, 2,7 MB" (medido con `du`, que cuenta bloques de disco) | 2,59 MiB (2 713 256 bytes) |
| "Accesibilidad: 100 en las tres páginas" | Correcto para Lighthouse móvil, pero en escritorio existía el defecto 1 |
| Formulario "verificado" | Solo había pruebas unitarias. El flujo en el navegador (éxito, 500, red, doble envío) se probó por primera vez en esta auditoría contra un servidor simulado. Mi primera versión del simulador no respondía el preflight CORS y la prueba del 500 pasaba por el motivo equivocado; se corrigió y se repitió |
| "El sitio no contacta ningún dominio externo" | Cierto al cargar; al enviar el formulario se contacta Supabase (esperado) |
| Cifras citadas en la solicitud ("25,7 MB → 2,63 MB, −90 %", "bundle 310 KB", "distribución 3,4 MB") | No están en el repo. 310,5 kB era el inicial bruto **antes** de la primera auditoría (hoy 356,3 kB, por decisión medida, §7). "3,4 MB" coincide con `du -h` del `dist` de entonces (3,19 MiB); hoy 3,28 MiB (3,44 MB decimales). Imágenes: §7 |

**Dependencias y por qué se conservan:** `@angular/*` (framework; `platform-browser-dynamic` lo usa el builder de Karma), `rxjs` (dependencia peer de Angular; el código propio no lo importa), `tslib` (`importHelpers`), `zone.js` (polyfill), `tailwindcss` + `@tailwindcss/postcss` + `postcss` (CSS), `sharp` (script de imágenes), Karma/Jasmine (pruebas).

## 4. Cambios implementados en esta auditoría

| Cambio | Archivos | Verificación |
|---|---|---|
| `aria-label="Ampliar imagen"` | `pages/projects/project-carousel.component.html` | axe 0 violaciones |
| Movimiento reducido: regla CSS global + `scrollBehavior()` | `src/styles.css`, `shared/motion.ts` (nuevo), `home.component.{ts,html}`, `projects.component.ts`, `project-carousel.component.ts` | Navegador con `prefers-reduced-motion: reduce` |
| Guarda contra doble envío, foco al primer error, `MAX_LENGTH` + `maxlength` | `contact.component.{ts,html}` | 3 pruebas unitarias nuevas + navegador |
| Foco al botón tras cerrar el menú con Escape | `layout.component.{ts,html}` | Navegador |
| 404 real para imágenes inexistentes | `public/_redirects`, `public/404.html` (nuevo) | Estática, contra la documentación de Netlify |
| Signo del porcentaje en el script | `scripts/convert-to-webp.js` | Ejecución con imagen de prueba |
| Ícono genérico `bolt` sin uso eliminado | `src/app/data/models.ts`, `src/app/data/tech.catalog.ts` | Build, `tsc`, 17/17 y navegador 43/43 + 34/34 |
| Documentación | `README.md`, `docs/ARQUITECTURA.md`, `docs/AUDITORIA_FRONTEND.md` (nota de histórico), este archivo | — |
| Worktree temporal retirado | `/tmp/headwt` (fuera del repo) | `git worktree list` |

## 5. Archivos de esta ronda

- **Modificados (sin stage, sobre el índice preparado a las 23:13):** `README.md`, `docs/ARQUITECTURA.md`, `docs/AUDITORIA_FRONTEND.md`, `public/_redirects`, `scripts/convert-to-webp.js`, `src/styles.css`, `src/app/layout/layout.component.{ts,html}`, `src/app/pages/contact/contact.component.{ts,html,spec.ts}`, `src/app/pages/home/home.component.{ts,html}`, `src/app/pages/projects/project-carousel.component.{ts,html}`, `src/app/pages/projects/projects.component.ts`, `src/app/data/models.ts`, `src/app/data/tech.catalog.ts`.
- **Nuevos (sin seguimiento):** `public/404.html`, `src/app/shared/motion.ts`, `docs/AUDITORIA_FINAL_FRONTEND.md`.
- **Movidos o eliminados:** ninguno en el repo. Fuera del repo: worktree `/tmp/headwt`.

## 6. Pruebas ejecutadas (resultados exactos)

| Prueba | Resultado |
|---|---|
| `npm ls --depth=0` | Sin extraneous/missing/invalid |
| Coherencia `package.json` ↔ `package-lock.json` | Idénticos |
| `ng build` (producción) | OK, sin advertencias. Inicial 356,24 kB bruto / 94,78 kB estimado transferido |
| Presupuestos (copia temporal, error a 300 kB) | Falla como se espera (código 1) |
| `ng test` (Karma, ChromeHeadless) | **17/17** |
| `tsc --noEmit` app y specs | 0 errores |
| Lint | No configurado (no se añadió dependencia) |
| Auditoría en navegador (puppeteer + axe-core 4.x incluido en Lighthouse 12.6.1) | **43/43**. Los 2 errores de consola registrados son el 500 y la caída de red simulados a propósito |
| Funcional e2e (puppeteer, POST bloqueados) | **34/34**, 0 errores de consola, 0 terceros |
| Sondas Supabase reales sin escritura | Columnas OK (`PGRST204` solo para la ficticia); `INSERT` de 0 filas → 201 (formulario) y 201 (`status`); `SELECT` → 0 filas; OpenAPI → 401 (solo `service_role`) |
| Dominio | GET a producción 200, título del portafolio |
| Clases de Tailwind | 381/381 presentes en el CSS |
| Calidad de imagen | SSIM medio 0,990, mínimo 0,976 (47 capturas) |
| Carga diferida | 10/47 capturas descargadas en escritorio y 15/47 en móvil al recorrer la página |
| `npm run images` | Crea, omite sin `--force`, regenera con `--force` |
| Lighthouse 12.6.1 | §7 |

Todas las pruebas se ejecutaron sobre builds de producción servidos localmente con gzip y fallback SPA. Ninguna se ejecutó contra Netlify.

## 7. Métricas comparables

Misma máquina, mismo build de producción, mismo servidor local y misma versión de Lighthouse (12.6.1, perfil móvil).

**Lighthouse, throttling simulado (mediana de 3 corridas):**

| Página | Antes de la 1.ª auditoría | Fin de la 1.ª auditoría | Cierre |
|---|---|---|---|
| Inicio: rendimiento / accesibilidad / LCP | 99 / 95 / 1,99 s | 99 / 100 / 2,11 s | **99 / 100 / 2,03 s** |
| Proyectos | 98 / 92 / 2,14 s | 99 / 100 / 1,98 s | **99 / 100 / 1,91 s** |
| Contacto | 98 / 96 / 2,13 s | 98 / 100 / 2,14 s | **98 / 100 / 2,14 s** |

El simulador varía ±0,15 s entre series (inicio "antes" dio 1,99 s y 2,13 s en dos series).

**Lighthouse, throttling real (`devtools`), LCP (mediana):**

| Página | Antes (5 corridas) | Fin de la 1.ª (5) | Cierre (3) |
|---|---|---|---|
| Inicio | 3,83 s | 2,72 s | **2,73 s** |
| Proyectos | 3,10 s | 2,57 s | **2,57 s** |
| Contacto | 3,06 s | 2,56 s | **2,58 s** |

**Bundle** (bruto = archivo sin comprimir; "transferido" = estimación gzip del CLI de Angular):

| | Antes de la 1.ª | Cierre |
|---|---|---|
| JS + CSS inicial | 310,52 kB bruto / 79,76 kB | 356,24 kB bruto / 94,78 kB |
| Chunk de contacto | 49,96 kB / 12,20 kB | 50,77 kB / 12,44 kB |

El inicial crece porque inicio pasó al bundle inicial, decisión tomada con la medición de throttling real (3,83 → 2,72 s).

**Imágenes** (MiB = 1 048 576 bytes, sumando el tamaño real de los archivos):

| Conjunto | HEAD `e2ebc99` | Ahora | Cambio |
|---|---|---|---|
| Las mismas 30 imágenes que usa la web | 24,20 MiB (PNG/JPEG) | 2,08 MiB (WebP) | −91,4 % |
| Total de raster en `public/` | 26,65 MiB (31 archivos, incluida `cristobalFOTOIA.png` sin uso, 2,45 MiB) | 2,63 MiB (48 WebP, incluidas 18 de Reconciliación que no existían: 0,55 MiB) | No comparable |
| `public/` completo | 27,45 MiB | 2,87 MiB | — |

## 8. Pendientes y motivo

1. **Prueba real del formulario** — requiere autorización para escribir en producción. Cómo hacerla: envía un mensaje desde el sitio desplegado (o desde `npm start`) y confírmalo en el panel de Supabase.
2. **Restringir el `INSERT` de `anon`** (columna `status` y longitudes) — es configuración remota. SQL en `ARQUITECTURA.md` §6.
3. **LCP de inicio con throttling real (2,73 s)** — la mejora requiere prerenderizar (§11), un cambio de arquitectura.
4. **PDF del CV** — `public/CV_Cristobal_Vizcaino.pdf` no refleja `docs/CV_Cristobal_Vizcaino.md`. Debes regenerarlo tú.
5. **Commit** — no se hizo por instrucción. Al hacerlo, incluye los cambios sin stage de esta ronda (`git add -A`).
6. **Netlify** — comprobar tras el próximo despliegue que `/images/no-existe.webp` responde 404 y que el directorio de publicación es `dist/portafolio-cjvm/browser`.

## 9. Verificaciones que no pudieron realizarse

| Verificación | Motivo |
|---|---|
| Inserción real en `contact_messages` | Sin entorno de pruebas; producción requiere autorización |
| Esquema completo de la tabla (tipos, `NOT NULL`, políticas) | OpenAPI y catálogo solo con `service_role` o panel |
| Comportamiento de `_redirects`/`_headers` en Netlify | Sin despliegue ni Netlify CLI; solo verificación estática contra la documentación |
| INP real | Necesita datos de campo o interacción instrumentada; TBT de laboratorio < 40 ms |
| Lectores de pantalla reales (NVDA/VoiceOver) | No disponibles; se usó axe-core y comprobaciones de foco y ARIA |

## 10. Riesgos conocidos

- **Abuso del formulario:** cualquiera con la clave pública puede insertar filas, también con `status` arbitrario, sin límite de frecuencia, hasta que se apliquen el SQL y, si hace falta, CAPTCHA o rate limiting.
- **Formulario en producción no confirmado:** si la tabla tuviera RLS activo sin política de `INSERT`, el envío fallaría. Se verá en la prueba del pendiente 1. El usuario recibiría el mensaje de error, nunca uno de éxito falso.
- **Chunks JS inexistentes tras un despliegue** (pestañas viejas): Netlify devuelve `index.html` y la navegación diferida falla. No se resuelve con `_redirects`.
- **Working tree compartido:** hay dos sesiones de Claude más (inactivas) sobre este repo y el índice lo preparó otro proceso a las 23:13. Revisa `git status` antes del commit.
- **Respaldos temporales:** el `.tgz` previo a la primera auditoría está en la carpeta temporal de la sesión, que no es permanente. `stash@{0}` sí persiste.

## 11. Recomendaciones futuras (no necesarias para cerrar)

| Opción | Beneficio | Riesgo y coste | Requisitos |
|---|---|---|---|
| **Prerender (SSG) con `@angular/ssr`, `outputMode: 'static'`** | La foto y el texto vienen en el HTML: es la vía para bajar el LCP real de inicio por debajo de 2,5 s y mejora el SEO | Nueva dependencia; hidratación (`provideClientHydration`); revisar APIs de navegador (`matchMedia` y `document` solo se usan en eventos, ya compatible); probar en un deploy preview | Tu aprobación; Netlify sirve el HTML estático por ruta |
| `srcset` 800w en capturas | −62 % de bytes en móviles de densidad ≤ 2 (668 KB al recorrer proyectos) | +47 archivos (~1,1 MB en el repo) y rutas por convención | Ampliar el script de imágenes |
| Zoneless | ~11 kB comprimidos menos (polyfill de zone.js) | Experimental en Angular 19 | Esperar a Angular 20.2+ (estable) |
| Angular 20 | Zoneless estable y mejoras del builder | Migración mayor | Ventana de mantenimiento y pruebas |
| AVIF | ~20–30 % menos que WebP (estimación general, no medida) | `<picture>` con dos formatos; más archivos | Bajo valor: la imagen más pesada ocupa 128 KB |
| `og:image` 1200×630 | Vista previa al compartir en LinkedIn y otras redes | Diseñar la imagen | Decisión de diseño |
| CSP en `_headers` | Defensa contra XSS | Ajustar para estilos de Angular y la conexión a Supabase | Deploy preview |
| ESLint (`angular-eslint`) | Análisis estático | Dependencia de desarrollo nueva | Tu aprobación |
| ~~URLs limpias con redirecciones~~ | **Hecho (§14)**: `/`, `/proyectos`, `/contacto` | — | — |

## 12. Estado final de Git

- Rama `refactor/auditoria-frontend`, HEAD `e2ebc99`. **No se hizo commit, push ni despliegue.**
- El índice lo prepara otro proceso con `git add -A` (última vez a las 23:50); ninguna de estas auditorías lo modificó salvo para quitar del stage el DOCX interno. Lo hecho después de esa hora (§14) está en el working tree sin stage, y `src/app/app.routes.spec.ts` sin seguimiento. `.cursor/` no está en `.gitignore`.
- Archivos sensibles: `git ls-files --stage` no contiene el DOCX interno ni `docs/fuentes-locales/`.
- Worktrees: solo el principal (`/tmp/headwt` retirado).
- Respaldos: `stash@{0}` intacto.

## 13. Anexo: alineación de la documentación y reglas de Cursor

Hecho después del cierre, a petición del usuario.

**Revisión de los `.md` existentes contra el código:**

| Archivo | Desalineaciones encontradas | Resultado |
|---|---|---|
| `README.md` | No mencionaba el informe histórico ni las reglas de Cursor | Actualizado |
| `docs/ARQUITECTURA.md` | El árbol de `docs/` omitía `AUDITORIA_FINAL_FRONTEND.md`; zoneless y ESLint remitían al informe histórico; decía TBT < 25 ms (medido: 37 ms en inicio); la lista de pruebas omitía las 3 nuevas del formulario | Corregido; nueva §10 con el mapa de documentos y reglas |
| `docs/AUDITORIA_FINAL_FRONTEND.md` | §12 describía un índice que ya había cambiado | Corregido (§12) y este anexo |
| `docs/AUDITORIA_FRONTEND.md` | Ninguna nueva: es histórico y ya lo indica su nota inicial | Sin cambios |
| `docs/CV_Cristobal_Vizcaino.md` | Fechas y cargos coinciden con `data/projects.data.ts`. Todas las tecnologías de los proyectos aparecen en el CV salvo "Signals", que es parte de Angular (el CV lista Angular 10–20) | Sin cambios. El PDF sigue pendiente de regenerar (§8) |

**Reglas de Cursor creadas** en `.cursor/rules/`, con formato `.mdc` y frontmatter `description`/`globs`/`alwaysApply`, según la documentación oficial de Cursor:

| Regla | Se aplica | Líneas |
|---|---|---|
| `00-proyecto.mdc` | Siempre | 39 |
| `angular-componentes.mdc` | `src/app/**/*.{ts,html,css}`, `src/styles.css` | 38 |
| `contenido-e-imagenes.mdc` | `src/app/data/**`, `public/images/**`, script de imágenes | 28 |
| `contacto-supabase.mdc` | `src/app/pages/contact/**`, `src/environments/**` | 19 |
| `pruebas.mdc` | `src/**/*.spec.ts` | 18 |
| `documentacion.mdc` | `**/*.md`, `.cursor/rules/*.mdc` | 29 |

Todas referencian `@docs/ARQUITECTURA.md`, que es la fuente de verdad, en lugar de copiarlo. La regla de documentación fija qué archivo cubre cada tema y obliga a actualizar documentos y reglas en el mismo cambio que el código.

**Verificación automática** (script fuera del repo) sobre los `.md` vigentes y las 6 reglas:

- Rutas de archivo citadas: todas existen, salvo las menciones intencionales de cosas retiradas, que el script lista con su motivo.
- Comandos `npm` citados: todos existen en `package.json`.
- URLs citadas: todas coinciden con `app.routes.ts` (desde §14, las antiguas `/menuNavbar/...` solo pueden aparecer como redirecciones existentes).
- Número de pruebas declarado (17): coincide con las 17 pruebas reales.
- Frontmatter: válido en las 6 reglas.
- Tabla de reglas: cada regla aparece en `ARQUITECTURA.md` §10.

El verificador se probó con un documento temporal que contenía una ruta, un archivo, un comando y una URL inexistentes, y detectó los 4 errores. Los cambios de este anexo son solo de documentación: no modifican código, build ni pruebas.

## 14. Anexo: URLs profesionales

Hecho a petición del usuario.

| Antes | Ahora |
|---|---|
| `/menuNavbar/aboutMePag1` | `/` |
| `/menuNavbar/proyectsPag2` (`#proyecto`) | `/proyectos` (`#proyecto`) |
| `/menuNavbar/contactPag3` | `/contacto` |

**Compatibilidad.** Las URLs antiguas siguen en el CV en PDF y en enlaces externos:

- **Netlify** (`public/_redirects`): 301 permanente hacia las nuevas, para que los buscadores trasladen el posicionamiento.
- **Router** (`LEGACY_REDIRECTS` en `app.routes.ts`): respaldo para el servidor de desarrollo u otro hosting.

Ambas conservan el ancla `#proyecto`.

**Archivos:**

- **Rutas:** `src/app/app.routes.ts`.
- **Enlaces internos:** 13 en `layout.component.html`, `footer.component.html`, `home.component.html` y `projects.component.html`.
- **Netlify y estáticos:** `public/_redirects`, `public/sitemap.xml` y `public/404.html`.
- **Comentario:** `src/app/data/models.ts`.
- **Prueba nueva:** `src/app/app.routes.spec.ts`, con 9 casos.
- **Documentación:** `README.md`, `docs/ARQUITECTURA.md` §4/§8/§9 y las reglas `00-proyecto.mdc`, `angular-componentes.mdc`, `contenido-e-imagenes.mdc` y `pruebas.mdc`.

**Verificación:**

| Prueba | Resultado |
|---|---|
| `ng build` | OK, sin advertencias. Inicial 356,23 kB bruto, prácticamente igual |
| `ng test` | **26/26**. Las 9 nuevas cubren las 3 URLs con su título, cada URL antigua → nueva (con ancla) y las rutas desconocidas → inicio |
| Funcional en el navegador sobre el build de producción | **38/38**. Las 4 nuevas comprueban que `/menuNavbar/aboutMePag1` → `/`, `/menuNavbar/contactPag3` → `/contacto`, `/menuNavbar/proyectsPag2#gif-generator` → `/proyectos#gif-generator` y que la sección queda arriba |
| Auditoría en el navegador | **43/43**. axe sin violaciones; texto de las 3 páginas idéntico a la línea base |
| Verificador de documentación | Sin problemas. Cada redirección antigua tiene su 301 en `_redirects`; el sitemap lista exactamente `/`, `/proyectos` y `/contacto`; todos los `routerLink` apuntan a rutas existentes; los documentos declaran las 26 pruebas que ejecuta Karma |

**Limitación:** los 301 de Netlify solo se verificaron contra su documentación, no en un despliegue. Tras desplegar, comprueba que `/menuNavbar/proyectsPag2` responde 301 hacia `/proyectos`.

