# Auditoría responsive — Portafolio CV

**Fecha:** 14 de octubre de 2026 · **Base:** commit `ed45c0f` (`main`) · **Alcance:** las 3 rutas, todos sus componentes y estados · **Sin commit, push ni despliegue.**

## 1. Resumen ejecutivo

### Conclusión: **APROBADO CON LIMITACIONES**

Todas las pruebas ejecutadas pasan después de las correcciones:

- **Matriz de 10 anchuras × 3 rutas:** 30/30.
- **Barrido de anchuras de 300 a 1920 px:** sin desborde en ninguna.
- **Condiciones e interacciones:** 273/273 verificaciones (horizontal, zoom 200 %, reflow 400 %, espaciado de texto, texto ampliado, palabras largas, menú, carrusel, gestos táctiles, vista ampliada, formulario, teclado y teclado virtual aproximado).
- **Regresión:** 38/38 funcionales y 43/43 de accesibilidad (axe-core sin violaciones; texto idéntico a la línea base).
- **Unitarias:** 26/26.

"Con limitaciones" porque todo se probó en Chromium con dispositivos emulados: no hubo teléfonos ni tabletas reales, ni Safari/WebKit o Firefox, ni teclado virtual real (§12).

**Defectos encontrados y corregidos (7):**

1. **Navbar entre 640 y 1023 px.** El nombre se partía en 3 líneas, "Acerca de mí" en 2, y entre 640 y 690 px "Contáctame" se salía de la pantalla (desborde de hasta 55 px).
2. **Contacto entre 300 y 375 px.** La tarjeta y el formulario desbordaban hasta 65 px y el correo quedaba cortado.
3. **Correo del footer entre 770 y 790 px.** Desbordaba su columna (hasta 9 px de desborde de la página).
4. **Palabras largas.** No había ninguna regla para partirlas: un nombre técnico largo desbordaba hasta 556 px o quedaba recortado en tarjetas con `overflow: hidden`.
5. **Texto ampliado al 200 %.** El header de altura fija, el nombre sin salto de línea, las etiquetas y pastillas de ancho fijo y el botón "Contáctame" se salían de la pantalla.
6. **Vista ampliada en móvil.** Las flechas tapaban los bordes de la captura.
7. **Puntos del carrusel.** Sobresalían 4 px de su contenedor (`-mx-1`), y la etiqueta del índice de proyectos medía 11 px.

## 2. Inventario auditado

| Área | Componentes y estados revisados |
|---|---|
| Layout | Header con nombre, menú de escritorio y menú hamburguesa (abierto, cerrado, Escape, clic fuera, navegación); `main`; footer (marca, navegación, correo, redes) |
| Inicio (`/`) | Título, botones "Ver Proyectos" y "Descargar CV", foto de perfil, "Acerca de mí" y sus pastillas, 8 categorías de habilidades con logos, 6 tarjetas de proyecto (con y sin portada, etiqueta, pastillas, "+N"), "Ver todos los proyectos" |
| Proyectos (`/proyectos`) | Índice de proyectos, 6 artículos (cabecera, estadísticas, carrusel, contexto, "Lo que construí", resultado, tecnologías), CTA final; carrusel (flechas, puntos, arrastre, gesto táctil, teclado) y vista ampliada (flechas, cerrar, Escape, bloqueo y restauración del scroll) |
| Contacto (`/contacto`) | Encabezado, tarjeta de datos (foto, nombre, estado, 4 enlaces, chips, "Descargar mi CV"), formulario (6 campos, errores, foco, envío, éxito, error, carga) |
| Compartidos | `app-tech-icon` (inicio y proyectos), footer (3 rutas), `motion.ts` |
| Estados | Menú abierto, vista ampliada, formulario vacío, con errores, enviando, éxito (201 simulado) y error (500 simulado) |

No hay modales aparte de la vista ampliada, ni estados vacíos: todo el contenido es estático (`data/`).

## 3. Resoluciones probadas

| Anchura × alto | Categoría | Emulación |
|---|---|---|
| 320×568, 360×800, 375×812, 390×844, 430×932 | Teléfonos | `isMobile`, táctil |
| 768×1024, 1024×768 | Tabletas | Táctil |
| 1280×800, 1440×900, 1920×1080 | Portátil y escritorio | Ratón |
| **300 → 1920 px** | Barrido | Cada 5 px hasta 1100 y cada 30 px hasta 1920 (3 rutas) |
| 568×320, 667×375, 844×390, 932×430 | Teléfonos en horizontal | `isMobile`, táctil |
| 640×400, 720×450, 960×540 | Zoom 200 % de 1280, 1440 y 1920 (viewport CSS equivalente) | — |
| 320×256 | Reflow WCAG 1.4.10 (1280 al 400 %) | — |

## 4. Problemas encontrados y causa

| # | Problema | Dónde | Causa |
|---|---|---|---|
| 1 | Desborde de hasta 55 px; nombre en 3 líneas; "Contáctame" cortado | Header, 640–1023 px (las 3 rutas) | El menú de escritorio aparecía en `sm` (640 px) con enlaces `px-6 text-lg` y `space-x-8`: no cabe junto al nombre hasta 1024 px. El nombre crecía a `md:text-3xl` |
| 2 | Desborde de hasta 65 px; correo cortado | Contacto, 300–375 px | La rejilla tiene `min-width: auto` por defecto, así que el contenido sin saltos (correo con `truncate`) fijaba un ancho mínimo mayor que la pantalla |
| 3 | Desborde de hasta 9 px | Footer, 770–790 px | `cristobaljulian123456@gmail.com` no tiene espacios y no cabía en la columna de 3 columnas |
| 4 | Desbordes de 39–556 px y texto recortado | Títulos de proyecto, habilidades, encabezados, tarjetas | Sin `overflow-wrap`: una palabra más ancha que su caja no se parte |
| 5 | Header, etiquetas, pastillas y CTA fuera de la pantalla con texto al 200 % | Varias | Altura fija (`h-20`), `whitespace-nowrap` en el nombre, etiquetas absolutas sin límite de ancho, filas flex que no podían reorganizarse |
| 6 | Flechas sobre la captura | Vista ampliada, < 640 px | Flechas centradas verticalmente a los lados con solo `px-4` de margen |
| 7 | Contenedor 4 px fuera de su padre; texto de 11 px | Puntos del carrusel; índice de proyectos | Margen negativo `-mx-1`; `text-[11px]` |

## 5. Cambios realizados

| Cambio | Archivo | Motivo |
|---|---|---|
| Menú de escritorio desde `lg` (1024 px), hamburguesa por debajo; enlaces `px-4 py-3` (`xl:px-6`), `whitespace-nowrap`, `flex-wrap`; nombre `text-base sm:text-2xl lg:text-3xl xl:text-4xl` con `wrap-anywhere`; header con `min-h-20 lg:min-h-32` en lugar de altura fija; enlaces del menú móvil de 48 px de alto | `layout/layout.component.html` | Problemas 1 y 5 |
| Correo en `<span class="min-w-0 wrap-anywhere">`, icono `shrink-0` | `layout/footer.component.html` | Problema 3 |
| `min-w-0` en las dos columnas; correo con `wrap-anywhere` en vez de `truncate`; fila foto-nombre con `flex-wrap` y nombre con `min-w-[min(8rem,100%)]`; estado con `max-w-full` | `pages/contact/contact.component.html` | Problemas 2 y 5 |
| Regla base `h1–h6, p, li, dt, dd, label, figcaption { overflow-wrap: anywhere }` | `src/styles.css` | Problema 4. Solo actúa cuando una palabra no cabe |
| Texto de habilidades `min-w-0`; etiqueta de tarjeta `left-3 right-3 w-fit`; título de portada y pastillas con `wrap-anywhere` y `max-w-full` | `pages/home/home.component.html` | Problemas 4 y 5 |
| Botones del índice `max-w-full flex-wrap`; etiqueta a `text-xs`; pastillas `max-w-full`; CTA `max-w-full px-6 sm:px-8` | `pages/projects/projects.component.html` | Problemas 5 y 7 |
| Sin `-mx-1` en los puntos; vista ampliada con `pb-20 sm:pb-6` y flechas `nav-btn--lightbox` | `pages/projects/project-carousel.component.{html,css}` | Problemas 6 y 7 |

No se añadió `overflow-x: hidden` en ningún sitio, no se ocultó contenido y no se cambió texto. El texto visible de las 3 páginas es idéntico al anterior (comprobado). Bundle inicial: 356,23 → 356,80 kB bruto.

## 6. Pruebas de navegador ejecutadas

Herramienta: puppeteer-core 23 con Google Chrome 149 (headless), ya disponibles en el entorno. No se instaló nada en el proyecto. Todas sobre el **build de producción** (`npm run build`) servido localmente con gzip y fallback SPA.

**A. Matriz (10 anchuras × 3 rutas).** Para cada combinación: carga, recorrido completo de la página (carga diferida) y luego:

- **Desborde:** el del documento y el de cada elemento, recortado por los contenedores con `overflow` para no contar el interior legítimo del carrusel; también elementos que sobresalen de su contenedor.
- **Contenido:** texto recortado (horizontal y vertical), imágenes rotas, imágenes deformadas (`object-fit: fill` con proporción distinta) y texto menor de 12 px.
- **Controles:** objetivos menores de 24 px sin el espaciado de WCAG 2.5.8 y controles tapados (cada control centrado en pantalla y comprobado con `elementFromPoint`).
- **Errores:** de consola, JavaScript y HTTP.

**B. Condiciones.**

- **Pantalla:** horizontal (4), zoom 200 % (3), reflow 400 %, espaciado de texto WCAG 1.4.12 y texto ampliado al 200 % (`font-size` raíz) a 320, 390 y 1280 px.
- **Contenido:** palabras de 49 caracteres sin espacios en títulos, habilidades, logros y encabezados a 320, 768 y 1440 px.

**C. Interacciones en las 10 anchuras.**

- **Menú:** tipo correcto según la anchura, botón de al menos 44×44, menú dentro de la pantalla, enlaces de al menos 44 px, Escape, navegación y cierre; en escritorio, enlaces en una línea.
- **Carrusel:** flecha no tapada, avance, diapositiva 16:9 con `object-fit: contain` y deslizamiento táctil en las 7 anchuras táctiles.
- **Vista ampliada:** la imagen cabe en la pantalla, las flechas no la tapan, "Cerrar" mide al menos 24 px y el scroll se recupera al cerrar.
- **Formulario:**
  - **Validación:** con el formulario vacío muestra 4 errores y lleva el foco al primer campo.
  - **Tamaño:** campos y botón miden al menos 44 px de alto y quedan dentro de la pantalla.
  - **Envío:** con datos largos (correo de 62 caracteres, mensaje de 400) el 201 simulado muestra éxito sin desbordar, y el 500 simulado muestra error.
- **Teclado:** foco visible y orden de arriba abajo en los 12 primeros elementos.
- **Errores:** ninguno en consola.

**D. Teclado virtual (aproximación).** A 390 px, el viewport se reduce a 420 px de alto y se enfocan los 6 campos: todos quedan visibles.

**E. Regresión.** Funcionales (38), accesibilidad con axe-core en 8 estados (43), unitarias (26) y una comprobación básica en `ng serve` (4 anchuras × 3 rutas + redirección antigua: sin desborde ni errores).

## 7. Resultados

| Prueba | Antes | Después |
|---|---|---|
| Matriz 10 × 3 | 15 de 30 combinaciones con hallazgos (desborde de 9 px a 768 en las 3 rutas, contacto a 320–375, puntos del carrusel en las 10 anchuras de proyectos, texto de 11 px) | **30/30 sin hallazgos** |
| Barrido 300–1920 px | Desborde en 62 anchuras (inicio y proyectos 640–690 y 770–790; contacto además 300–375) | **0** |
| Condiciones + interacciones | Varios fallos en palabras largas y texto al 200 % (desbordes de hasta 556 px); la primera ejecución se detuvo antes de terminar por un error del propio script, así que no hay un total previo exacto | **273/273** |
| Funcionales / accesibilidad / unitarias | 38/38 · 43/43 · 26/26 | **38/38 · 43/43 · 26/26** |
| Lighthouse (móvil, simulado) | — | Rendimiento 97–98; accesibilidad, buenas prácticas y SEO 100; CLS 0 |

TBT medido de forma alterna sobre el build anterior y el nuevo, en la misma máquina y al mismo tiempo (mediana de 3): inicio 147 → 160 ms, proyectos 123 → 113 ms, contacto 123 → 123 ms; LCP idéntico (1,95–1,99 s). Diferencia dentro del ruido y por debajo de la meta de 200 ms. Los valores son más altos que los de la auditoría del 13 de octubre porque el equipo tenía más carga; el build anterior medido ahora da lo mismo.

## 8. Errores de consola y red

Ninguno en las rutas, interacciones ni anchuras probadas. En las pruebas del formulario aparecen, a propósito, el 500 y el fallo de red simulados, que se filtran como esperados. No se envió nada a Supabase: la petición se interceptó en el navegador.

## 9. Capturas

En [`docs/evidencias/responsive/`](evidencias/responsive/) (13 archivos, 1,9 MB):

- **Página completa de cada ruta:** `inicio`, `proyectos` y `contacto` a 320, 768 y 1440 px. Las de 1440 px están reducidas al 50 % y `proyectos-320` es JPEG porque supera el alto máximo de WebP (16 383 px).
- **Estados:** `estado-menu-movil-320`, `estado-vista-ampliada-390`, `estado-formulario-errores-320` y `estado-header-1024`.

## 10. Pruebas que no pudieron ejecutarse

| Prueba | Motivo |
|---|---|
| Dispositivos físicos (iPhone, Android, iPad) | No disponibles |
| Safari/WebKit y Firefox | Solo hay Chromium; no se instaló Playwright para no añadir herramientas pesadas |
| Teclado virtual real | No existe en headless; se aproximó reduciendo el alto del viewport |
| Zoom real del navegador | Se emuló con el viewport CSS equivalente (1280 al 200 % = 640 px), que es lo que produce el zoom |
| Lectores de pantalla | No disponibles; se usó axe-core |

## 11. Limitaciones del entorno

- **Gestos táctiles:** se sintetizan con el protocolo de Chrome (`Input.dispatchTouchEvent`); funcionaron, pero no reproducen inercia ni velocidad real.
- **Texto ampliado al 200 %:** se aplicó como `font-size` raíz. Como el espaciado del sitio está en `rem`, también se duplica, lo que lo hace más exigente que el "solo texto" de Firefox.
- **Lighthouse:** es una medición de laboratorio en una sola máquina con carga variable.

## 12. Pendientes

1. **Probar en dispositivos reales** al menos un iPhone (Safari) y un Android (Chrome), y Firefox de escritorio. Pasos: abrir las 3 rutas, el menú, el carrusel con el dedo, la vista ampliada y el formulario con el teclado virtual.
2. **Revisar tras el próximo despliegue** que el header y el carrusel se ven igual en Netlify. No cambia nada del servidor, pero no se probó publicado.

## 13. Conclusión final

**APROBADO CON LIMITACIONES.** En Chromium no queda ningún defecto reproducible en las 3 rutas, las 10 anchuras de la matriz, el barrido de 300 a 1920 px, las orientaciones horizontales, el zoom al 200 %, el reflow al 400 %, el texto ampliado y las interacciones probadas. Las limitaciones son las de §10: dispositivos reales, otros motores y teclado virtual real. Esta auditoría solo certifica las condiciones que realmente se comprobaron.
