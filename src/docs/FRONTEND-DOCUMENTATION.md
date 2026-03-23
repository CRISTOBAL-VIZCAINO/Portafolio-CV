# Documentación del Frontend - Portafolio-CJVM

> **Fecha de generación**: Marzo 2026  
> **Framework**: Angular 19.2.x (Standalone)  
> **Autor del portafolio**: Cristóbal Vizcaíno Mercado

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Modelo de Arquitectura C4](#2-modelo-de-arquitectura-c4)
   - [Nivel 1 - Contexto del Sistema](#nivel-1---contexto-del-sistema)
   - [Nivel 2 - Contenedores](#nivel-2---contenedores)
   - [Nivel 3 - Componentes](#nivel-3---componentes)
   - [Nivel 4 - Código](#nivel-4---código-detalle-de-clases-clave)
3. [Estructura de Carpetas](#3-estructura-de-carpetas)
4. [Sistema de Ruteo](#4-sistema-de-ruteo)
5. [Contenido UI Detallado por Página](#5-contenido-ui-detallado-por-página)
   - [MenuNavbarPag1 (Layout / Navbar)](#51-menunavbarpag1-layout--navbar)
   - [HomePag2 - Página "Acerca de Mí"](#52-homepag2---página-acerca-de-mí-home)
   - [AboutMePag3 - Página "Proyectos Detallados"](#53-aboutmepag3---página-proyectos-detallados)
   - [ProjetcsPag4 - Página "Contacto"](#54-projetcspag4---página-contacto)
   - [FooterPages (Compartido)](#55-footerpages-compartido)
6. [Capa de Servicios, Interfaces y Supabase](#6-capa-de-servicios-interfaces-y-supabase)
7. [Stack Tecnológico](#7-stack-tecnológico)
8. [Patrones Arquitectónicos Utilizados](#8-patrones-arquitectónicos-utilizados)
9. [Observaciones y Posibles Issues](#9-observaciones-y-posibles-issues)
10. [Configuración de Supabase](#10-configuración-de-supabase)

---

## 1. Visión General del Proyecto

**Portafolio-CJVM** es un portafolio web personal de **Cristóbal Vizcaíno**, construido con **Angular 19.2** usando la arquitectura **standalone** (sin `NgModules`). Utiliza **TailwindCSS 4** + **DaisyUI 5** para estilos.

> El formulario de contacto se conecta directamente a **Supabase** (BaaS) mediante el SDK `@supabase/supabase-js`, insertando registros en la tabla `contact_messages`. No existe un backend intermedio; la comunicación es frontend → Supabase.

### Propósito

El sitio web tiene tres objetivos principales:

- **Presentar** al desarrollador (biografía, foto, habilidades técnicas)
- **Mostrar** proyectos profesionales y personales con capturas de pantalla y descripciones detalladas
- **Permitir contacto** a través de un formulario que envía datos directamente a Supabase

---

## 2. Modelo de Arquitectura C4

### Nivel 1 - Contexto del Sistema

```
+-------------------+         +----------------------+
|    Visitante      |         |   Redes Sociales     |
|   (Navegador)     |         | (LinkedIn, GitHub,   |
|                   |         |  Twitter)            |
+--------+----------+         +----------+-----------+
         |                               ^
         | HTTPS                         | Enlaces externos
         v                               |
+--------+----------------------------+--+
|       Portafolio-CJVM (SPA)             |
|  Angular 19 + Tailwind + DaisyUI        |
|  Muestra info profesional, proyectos    |
|  y formulario de contacto               |
+---------+-------------------------------+
          |
          | Supabase JS SDK (insert)
          v
+---------+----------+
|   Supabase (BaaS)  |
|  PostgreSQL hosted  |
|  Tabla:             |
|  contact_messages   |
+--------------------+
```

**Actores:**

| Actor | Descripción |
|---|---|
| **Visitante** | Persona que accede al portafolio desde su navegador |
| **Redes Sociales** | Plataformas externas enlazadas desde el footer (LinkedIn, GitHub, Twitter) |
| **Supabase** | Backend-as-a-Service con base de datos PostgreSQL que almacena los mensajes de contacto en la tabla `contact_messages` |

---

### Nivel 2 - Contenedores

```
+----------------------------------------------------------+
|                  Portafolio-CJVM (SPA)                    |
|                                                          |
|  +------------------+    +-------------------+           |
|  |  Angular Router  |    |  Supabase Client  |           |
|  |  (app.routes.ts) |--->|  (conectBack      |---------->  Supabase
|  |                  |    |   .service.ts)     |  SDK      |  (PostgreSQL)
|  +--------+---------+    +-------------------+           |
|           |                                              |
|  +--------v---------+    +-------------------+           |
|  |  Pages           |    |  Components       |           |
|  |  (3 vistas)      |    |  (Navbar, Footer) |           |
|  +------------------+    +-------------------+           |
|                                                          |
|  +------------------+    +-------------------+           |
|  |  TailwindCSS 4   |    |  DaisyUI 5        |           |
|  |  (utilidades)    |    |  (carousel, btn,  |           |
|  |                  |    |   dropdown, navbar)|           |
|  +------------------+    +-------------------+           |
+----------------------------------------------------------+
```

| Contenedor | Responsabilidad |
|---|---|
| **Angular Router** | Gestión de navegación SPA con lazy loading de componentes standalone |
| **Supabase Client** | Comunicación directa con Supabase (PostgreSQL) para persistir mensajes de contacto |
| **Pages** | 3 vistas principales (Home, Proyectos, Contacto) |
| **Components** | Componentes reutilizables (Navbar, Footer) |
| **TailwindCSS 4** | Framework de utilidades CSS para estilos |
| **DaisyUI 5** | Componentes UI preconstruidos (carousel, dropdown, navbar, buttons) |

---

### Nivel 3 - Componentes

```
                        AppComponent
                        <router-outlet/>
                             |
                    +--------v---------+
                    | MenuNavbarPag1   |
                    | (Layout wrapper) |
                    | Navbar + <router-outlet/>
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v------+  +----v--------+
     | HomePag2   |  | AboutMePag3 |  | ProjetcsPag4|
     | (Home/     |  | (Proyectos  |  | (Contacto)  |
     |  About Me) |  |  detallados)|  | Formulario  |
     +-----+------+  +------+------+  +------+------+
           |                |                |
           v                v                v
     FooterPages      FooterPages      FooterPages
     Component        Component        Component
```

| Componente | Selector | Rol |
|---|---|---|
| `AppComponent` | `app-root` | Raíz de la aplicación, solo contiene `<router-outlet/>` |
| `MenuNavbarPag1Component` | `app-menu-navbar-pag1` | Layout wrapper: navbar + `<router-outlet/>` para rutas hijas |
| `HomePag2Component` | `home-pag2` | Página principal: bio, habilidades, preview de proyectos |
| `AboutMePag3Component` | `app-about-me-pag3` | Página de proyectos detallados con carousels |
| `ProjetcsPag4Component` | `app-projetcs-pag4` | Página de contacto con formulario reactivo |
| `FooterPagesComponent` | `footer-pages` | Footer reutilizable con navegación, redes y contacto |

---

### Nivel 4 - Código (Detalle de clases clave)

```
+----------------------------------+
| HomePag2Component                |
|----------------------------------|
| - proyectosSection: ElementRef   |
| - router: Router                 |
|----------------------------------|
| + scrollToProjects(): void       |
| + navigateToAboutMe(): void      |
| + downloadCV(): void             |
+----------------------------------+

+----------------------------------+
| AboutMePag3Component             |
|----------------------------------|
| - router: Router                 |
|----------------------------------|
| + navigateToContact(): void      |
+----------------------------------+

+----------------------------------+
| ProjetcsPag4Component            |
|----------------------------------|
| - contactForm: FormGroup         |
| - submitted: boolean             |
| - fb: FormBuilder                |
| - userService: UserService       |
|----------------------------------|
| + onSubmit(): void               |
+----------------------------------+

+----------------------------------+
| UserService                      |
|----------------------------------|
| - apiUrl: string                 |
| - http: HttpClient               |
|----------------------------------|
| + getAllUsers(): Observable<User[]>|
| + createUser(user): Observable   |
| + getUserById(id): Observable    |
| + updateUser(user): Observable   |
| + deleteUser(id): Observable     |
+----------------------------------+

+----------------------------------+
| User (Interface)                 |
|----------------------------------|
| id?: number                      |
| user_name: string                |
| email_address: string            |
| user_message: string             |
+----------------------------------+
```

---

## 3. Estructura de Carpetas

```
Portafolio-CJVM/
├── angular.json                  # Configuración del proyecto Angular
├── package.json                  # Dependencias y scripts npm
├── tsconfig.json                 # Config base de TypeScript
├── tsconfig.app.json             # Config TS para la app
├── tsconfig.spec.json            # Config TS para tests
│
├── public/                       # Assets estáticos
│   ├── aws-logo.svg
│   ├── bitbucket-logo.svg
│   ├── jest-logo.svg
│   └── nestjs-logo.svg
│
└── src/
    ├── index.html                # HTML raíz (punto de entrada del navegador)
    ├── main.ts                   # Bootstrap standalone (sin NgModule)
    ├── styles.css                # Estilos globales (Tailwind + DaisyUI)
    │
    ├── docs/                     # Documentación del proyecto
    │   └── FRONTEND-DOCUMENTATION.md
    │
    └── app/
        ├── app.component.ts      # Componente raíz (solo <router-outlet/>)
        ├── app.component.html    # Template raíz
        ├── app.component.css     # Estilos raíz (vacío)
        ├── app.config.ts         # Configuración de providers (Router, HttpClient)
        ├── app.routes.ts         # Definición de todas las rutas
        │
        ├── environments/         # Configuración por entorno
        │   ├── environment.ts        # Desarrollo (Supabase URL + anonKey)
        │   └── environment.prod.ts   # Producción
        │
        ├── components/           # Componentes reutilizables (shared)
        │   ├── MenuNavbar/       # Navbar + layout principal
        │   │   ├── MenuNavbarPag1.component.ts
        │   │   ├── MenuNavbarPag1.component.html
        │   │   └── MenuNavbarPag1.component.css
        │   └── footerPages/      # Footer compartido en todas las páginas
        │       ├── footerPages.component.ts
        │       ├── footerPages.component.html
        │       └── footerPages.component.css
        │
        ├── interfaces/           # Modelos de datos / contratos TypeScript
        │   └── requisitos.interface.ts   # ContactMessage + ContactMessageInsert
        │
        ├── pages/                # Páginas/vistas principales
        │   ├── AboutMePag1/      # Página "Acerca de mí" (Home)
        │   │   ├── HomePag2.component.ts
        │   │   ├── HomePag2.component.html
        │   │   └── HomePag2.component.css
        │   ├── ProyectsPag2/     # Página "Proyectos" (detalle completo)
        │   │   ├── aboutMePag3.component.ts
        │   │   ├── aboutMePag3.component.html
        │   │   └── aboutMePag3.component.css
        │   └── ContactamePag3/   # Página "Contacto" (formulario)
        │       ├── projetcsPag4.component.ts
        │       ├── projetcsPag4.component.html
        │       └── projetcsPag4.component.css
        │
        └── services/             # Servicios (comunicación con Supabase)
            └── conectBack.service.ts   # ContactService - Inserción en Supabase
```

### Descripción por carpeta

| Carpeta | Contenido | Propósito |
|---|---|---|
| `public/` | SVGs de logos (AWS, Bitbucket, Jest, NestJS) | Assets estáticos servidos directamente |
| `src/app/components/` | `MenuNavbar/` y `footerPages/` | Componentes compartidos entre todas las páginas |
| `src/app/pages/` | 3 subcarpetas (AboutMePag1, ProyectsPag2, ContactamePag3) | Vistas principales de la aplicación |
| `src/app/environments/` | `environment.ts`, `environment.prod.ts` | Credenciales de Supabase por entorno |
| `src/app/interfaces/` | `requisitos.interface.ts` | Contratos TypeScript (`ContactMessage`, `ContactMessageInsert`) |
| `src/app/services/` | `conectBack.service.ts` | `ContactService` — comunicación con Supabase |
| `src/docs/` | Documentación del proyecto | Archivos de referencia y contexto |

---

## 4. Sistema de Ruteo

La app usa **lazy loading con standalone components** (`loadComponent`). Toda la navegación se define en un único archivo: `src/app/app.routes.ts`.

### Tabla de Rutas

| Ruta completa | Componente cargado | Finalidad |
|---|---|---|
| `/menuNavbar` | `MenuNavbarPag1Component` | **Layout wrapper** — contiene el navbar superior y un `<router-outlet/>` para renderizar las rutas hijas |
| `/menuNavbar/aboutMePag1` | `HomePag2Component` | **Página principal (Home/About Me)** — presentación personal, grid de habilidades técnicas y preview de 3 proyectos |
| `/menuNavbar/proyectsPag2` | `AboutMePag3Component` | **Página de proyectos detallados** — experiencia laboral y proyectos personales con carousels de imágenes y descripciones extensas |
| `/menuNavbar/contactPag3` | `ProjetcsPag4Component` | **Página de contacto** — formulario reactivo con campos nombre, email, empresa, teléfono, asunto y mensaje. Envía datos directamente a Supabase |
| `**` (wildcard) | Redirect → `/menuNavbar/aboutMePag1` | Cualquier ruta no encontrada redirige a la página principal |

### Diagrama de flujo de navegación

```
URL cualquiera ──> redirect ──> /menuNavbar/aboutMePag1
                                      │
                    [Navbar links] ────┼──── "Acerca de mí" ──> /menuNavbar/aboutMePag1
                                       │
                                       ├──── "Proyectos"    ──> /menuNavbar/proyectsPag2
                                       │
                                       └──── "Contáctame"   ──> /menuNavbar/contactPag3
```

### Configuración del Router (`app.config.ts`)

Los providers se configuran en `app.config.ts` (no en un módulo):

- `provideRouter(routes)` — inyecta las rutas
- `provideHttpClient()` — habilita HttpClient para servicios
- `provideZoneChangeDetection({ eventCoalescing: true })` — optimiza la detección de cambios

---

## 5. Contenido UI Detallado por Página

### 5.1 MenuNavbarPag1 (Layout / Navbar)

**Archivo**: `components/MenuNavbar/MenuNavbarPag1.component.html` (59 líneas)

#### Contenido UI:

- **Navbar fija** con fondo blanco y sombra, altura responsiva (`h-20` en móvil, `h-32` en desktop)
- **Logo/Nombre** centrado: "Cristóbal Vizcaíno M" con gradiente azul→verde animado al hover
- **Menú desktop** (visible en `sm` y superior): 3 enlaces con iconos SVG inline
  - "Acerca de mí" — icono de persona
  - "Proyectos" — icono de gráfico de barras
  - "Contáctame" — icono de sobre/email
- **Menú móvil** (visible en `<sm`): dropdown DaisyUI con botón hamburguesa, mismos 3 enlaces
- **`<router-outlet/>`** dentro de un `div.pt-16` donde se renderizan las páginas hijas

#### Comportamiento:

- Navegación SPA usando `routerLink`
- Efectos hover: scale, shadow, cambio de color
- Dropdown móvil: componente `dropdown-end` de DaisyUI con `z-50`

---

### 5.2 HomePag2 - Página "Acerca de Mí" (Home)

**Archivo**: `pages/AboutMePag1/HomePag2.component.html` (322 líneas)

#### Secciones UI:

**1. Hero / Presentación** (líneas 1-25)
- Título principal: *"Soy Cristóbal Vizcaíno, un desarrollador web, que siempre está abierto a nuevos retos."*
- 2 botones CTA:
  - **"Ver Proyectos"** — gradiente azul, hace scroll suave hacia la sección de proyectos (`scrollToProjects()`)
  - **"Descargar CV"** — borde azul sobre fondo blanco, descarga archivo `.docx` (`downloadCV()`)

**2. Sección "Acerca de mí"** (líneas 27-40)
- Layout flex: foto personal (1/3) + texto descriptivo (2/3)
- Foto con efecto hover scale
- Fondo `bg-gray-800` con bordes redondeados
- Texto: *"Desarrollador Full-Stack con +2 años de experiencia transformando requisitos complejos en soluciones escalables..."*

**3. Grid de Habilidades** (líneas 46-251) — **16 tarjetas** en grid responsivo (1/2/3 columnas):

| Habilidad | Icono | Descripción |
|---|---|---|
| Angular | SVG inline | Migración a Angular 18, lazy loading, modularización |
| HTML5 | SVG inline | Maquetación semántica y accesible |
| CSS3 | SVG inline | Flexbox, Grid, Tailwind/DaisyUI |
| TypeScript | SVG inline | Tipado estático, interfaces, genéricos |
| JavaScript (ES6+) | SVG inline | Promesas, async/await, módulos |
| Git & GitHub | SVG inline | Ramas, PRs, merge/rebase |
| Node.js | SVG inline | APIs REST, scripts, npm/yarn |
| NestJS | `nestjs-logo.svg` | Arquitectura modular, microservicios, DI |
| API Integration | SVG inline | HttpClient, fetch, tokens, manejo de errores |
| Performance Optimization | SVG inline | Code splitting, prefetching, lazy loading |
| Responsive Design | SVG inline | Media queries, adaptabilidad multi-dispositivo |
| JSON Handling | SVG inline | Lectura/manipulación de JSON |
| Python | CDN devicon | Migración a Node.js, FastAPI, Flask |
| AWS | `aws-logo.svg` | S3, SQS, Lambda |
| Jest | `jest-logo.svg` | Tests unitarios, mocks, CI |
| Bitbucket | `bitbucket-logo.svg` | Repos privados, PRs, pipelines YAML |

**4. Preview de Proyectos** (líneas 255-316) — 3 cards con:

| Proyecto | Imagen | Tags | Descripción |
|---|---|---|---|
| Gif Generator | `gifs.png` | Angular, API | Búsqueda de gifs con API de Giphy |
| Country Explorer | `paises.png` | Angular, REST | Info de países con búsqueda y filtrado |
| Tesla Shop Clone | `Teslop shop.png` | Angular, Firebase | Réplica e-commerce con carrito y autenticación |

- Botón **"Ver más proyectos..."** que navega a `/menuNavbar/proyectsPag2`

**5. Footer** — componente `<footer-pages>`

#### Métodos del componente:

| Método | Acción |
|---|---|
| `scrollToProjects()` | Scroll suave hasta `#proyectosSection` usando `ViewChild` + `scrollIntoView` |
| `navigateToAboutMe()` | Navega a `/menuNavbar/proyectsPag2` y hace scroll al top |
| `downloadCV()` | Crea un enlace temporal para descargar `Cristobal_Vizcaino_CV-FWEB-ES-Final.docx` |

---

### 5.3 AboutMePag3 - Página "Proyectos Detallados"

**Archivo**: `pages/ProyectsPag2/aboutMePag3.component.html` (780 líneas)

#### Secciones UI — 4 proyectos con carousels DaisyUI:

**1. Experiencia Laboral - GIF Generator** (líneas 9-136)
- **Carousel**: 2 screenshots (`GIFS-IMG-1.png`, `GIFS-IMG-2.png`)
- **Contexto**: Prueba de ingreso para Puropollo
- **Descripción técnica**:
  - Memoria de scroll (retoma posición al recargar)
  - Historial de búsqueda con `localStorage`
  - Lazy loading y arquitectura modular
  - Componentes reutilizables y servicios inyectables
- **Tags**: Angular 19, Responsive Design, API REST Countries, TailwindCSS, Bootstrap, HTML5, CSS3, Postman, JSON

**2. Experiencia Laboral - Puropollo S.A.S** (líneas 138-403)
- **Carousel**: 13 screenshots (`PP-IMG1.png` a `PP-IMG13.png`)
- **Descripción técnica**:
  - Migración de Angular 14 a Angular 18
  - Reemplazo de Bootstrap por TailwindCSS
  - Sistema de lazy loading para rendimiento
  - Dashboard administrativo con visualizaciones en tiempo real
  - Sistema de autenticación robusto
- **Tags**: Angular 18, Lazy Loading, Node.js, CSS3, HTML5, JavaScript, Git, GitHub, JSON, Bootstrap, Tailwind, DaisyUI, Postman

**3. Proyecto Personal - Buscador de Países** (líneas 405-559)
- **Carousel**: 5 screenshots (`Paises-IMG1.png` a `Paises-IMG5.png`)
- **Descripción técnica**:
  - Búsqueda por nombre, capital o región vía API REST Countries
  - Angular 19 con signals y observables
  - Memory scroll y persistencia con `localStorage`
  - Lazy loading y componentes desacoplados
- **Tags**: Angular 19, Responsive Design, Stripe, TailwindCSS, Firebase, HTML5, CSS3, TypeScript, JWT

**4. Experiencia Laboral - Teslop Shop** (líneas 561-768)
- **Carousel**: 6 screenshots (`Teslop-IMG1.png` a `Teslop-IMG6.png`)
- **Descripción técnica**:
  - E-commerce de ropa (equipo de 5 personas)
  - Integración de Stripe para pagos
  - Firebase como backend (auth, almacenamiento, pedidos)
  - Panel de administración para gestión de productos
- **Tags**: Angular 19, Firebase, Stripe, TailwindCSS, Lazy Loading, HTML5, CSS3, Node.js, Netlify, Docker, Postman, JSON, API REST, Git, GitHub

**5. Botón "Contáctame"** al final → navega a `/menuNavbar/contactPag3`

**6. Footer** — componente `<footer-pages>`

---

### 5.4 ProjetcsPag4 - Página "Contacto"

**Archivo**: `pages/ContactamePag3/projetcsPag4.component.html`

#### Contenido UI:

- **Contenedor oscuro** (`bg-[#1a1a1a]`) con borde gris, bordes redondeados y sombra
- **Título**: "¡Hablemos!" en color verde (`text-green-400`)
- **Subtítulo**: *"Si estás interesado en mi trabajo o tienes alguna inquietud, no dudes en escribirme!"*
- **Banner de feedback** dinámico: verde para éxito, rojo para error (reemplaza los `alert()` anteriores)
- **Formulario reactivo** conectado a **Supabase** con los siguientes campos:

| Campo | Tipo | Validación | Placeholder | Requerido |
|---|---|---|---|---|
| Nombre completo | `text` | `Validators.required` | "Tu nombre completo" | Sí |
| E-mail | `email` | `Validators.required` + `Validators.email` | "ejemplo@correo.com" | Sí |
| Empresa | `text` | Ninguna | "Nombre de tu empresa" | No |
| Teléfono | `tel` | Ninguna | "+57 300 000 0000" | No |
| Asunto | `text` | `Validators.required` | "¿Sobre qué quieres hablar?" | Sí |
| Mensaje | `textarea` (6 rows) | `Validators.required` | "Cuéntame más sobre tu proyecto..." | Sí |

- **Validación inline**: mensajes de error rojos debajo de cada campo al ser tocado y estar vacío/inválido
- **Botón "Enviar mensaje"**: fondo verde con spinner SVG animado durante el envío, deshabilitado si el formulario es inválido o se está enviando

#### Lógica del componente (`onSubmit()`):

1. Valida el formulario → si es inválido, marca todos los campos como `touched` para mostrar errores
2. Activa estado `sending = true` (muestra spinner, deshabilita botón)
3. Construye un objeto `ContactMessageInsert` con `full_name`, `email`, `company`, `phone`, `subject`, `message`
4. Llama a `ContactService.sendMessage(payload)` que inserta directamente en la tabla `contact_messages` de Supabase
5. **Éxito**: resetea el formulario + muestra banner verde de confirmación
6. **Error**: log en consola + muestra banner rojo de error
7. Restaura `sending = false` y fuerza detección de cambios con `ChangeDetectorRef` (necesario por `OnPush`)

---

### 5.5 FooterPages (Compartido)

**Archivo**: `components/footerPages/footerPages.component.html` (72 líneas)

#### Layout en 3 columnas (grid responsive):

| Columna | Contenido |
|---|---|
| **Izquierda** | Nombre "Cristóbal Vizcaíno" + navegación: Acerca de mí, Proyectos, Contáctame (con iconos SVG) |
| **Centro** | "Conéctate" + iconos de redes sociales: LinkedIn, GitHub, Twitter |
| **Derecha** | Email: `cristobaljulian123456@gmail.com` + enlace LinkedIn + © 2025 |

#### Enlaces externos:
- LinkedIn: `linkedin.com/in/cristóbal-vizcaino-mercado-1a82a3359`
- GitHub: `github.com/CRISTOBAL-VIZCAINO`
- Twitter: `twitter.com/cristobaljulian`
- Email: `cristobaljulian123456@gmail.com`

---

## 6. Capa de Servicios, Interfaces y Supabase

### Conexión con Supabase

El frontend se conecta directamente a **Supabase** usando el SDK oficial `@supabase/supabase-js`. No existe un backend intermedio; la comunicación es:

```
Formulario → ContactService → Supabase SDK → PostgreSQL (contact_messages)
```

#### Configuración (`environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://pctqjenpqryrbywiqenf.supabase.co',
    anonKey: 'TU_ANON_KEY_AQUI'   // ← reemplazar con la anon key de Supabase
  }
};
```

> **Importante**: La `anonKey` se obtiene desde el dashboard de Supabase: **Settings → API → Project API keys → anon public**.

### ContactService (`services/conectBack.service.ts`)

Servicio inyectable (`providedIn: 'root'`) que inicializa el cliente Supabase e inserta mensajes en la tabla `contact_messages`.

| Método | Parámetro | Retorno | Descripción |
|---|---|---|---|
| `sendMessage(payload)` | `ContactMessageInsert` | `Promise<ContactMessage>` | Inserta un mensaje en `contact_messages` y retorna el registro creado |

### Interfaces (`interfaces/requisitos.interface.ts`)

#### `ContactMessage` — Modelo completo de la tabla

```typescript
export interface ContactMessage {
  id?: string;                                          // UUID auto-generado por PostgreSQL
  public_id?: string;                                   // ID público (formato MSG-XXXXXXXX)
  full_name: string;                                    // Nombre completo del visitante
  email: string;                                        // Email del visitante
  company?: string;                                     // Empresa (opcional)
  phone?: string;                                       // Teléfono (opcional)
  subject: string;                                      // Asunto del mensaje
  message: string;                                      // Contenido del mensaje
  status?: 'new' | 'read' | 'replied' | 'archived';    // Estado (default: 'new')
  created_at?: string;                                  // Timestamp de creación
  updated_at?: string;                                  // Timestamp de última actualización
}
```

#### `ContactMessageInsert` — Tipo para inserción (solo campos enviados por el formulario)

```typescript
export type ContactMessageInsert = Pick<
  ContactMessage,
  'full_name' | 'email' | 'subject' | 'message'
> & Partial<Pick<ContactMessage, 'company' | 'phone'>>;
```

#### Ejemplo de payload que el frontend envía a Supabase

```json
{
  "full_name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "company": "Mi Empresa S.A.",
  "phone": "+57 300 123 4567",
  "subject": "Consulta sobre desarrollo web",
  "message": "Hola, me interesa tu trabajo..."
}
```

Los campos `id`, `public_id`, `status`, `created_at` y `updated_at` son generados automáticamente por PostgreSQL.

### Tabla Supabase: `contact_messages`

| Columna | Tipo | Nullable | Default | Descripción |
|---|---|---|---|---|
| `id` | `uuid` | No | `gen_random_uuid()` | Clave primaria |
| `public_id` | `text` | No | `MSG-` + 8 chars UUID | ID público legible |
| `full_name` | `text` | No | — | Nombre del visitante |
| `email` | `text` | No | — | Email del visitante |
| `company` | `text` | Sí | `null` | Empresa (opcional) |
| `phone` | `text` | Sí | `null` | Teléfono (opcional) |
| `subject` | `text` | No | — | Asunto del mensaje |
| `message` | `text` | No | — | Contenido del mensaje |
| `status` | `text` | No | `'new'` | Estado: `new`, `read`, `replied`, `archived` |
| `created_at` | `timestamptz` | No | `now()` | Fecha de creación |
| `updated_at` | `timestamptz` | No | `now()` | Última actualización (trigger automático) |

---

## 7. Stack Tecnológico

### Dependencias de producción

| Tecnología | Versión | Propósito |
|---|---|---|
| Angular Core | ^19.2.0 | Framework principal |
| Angular Router | ^19.2.0 | Navegación SPA |
| Angular Forms | ^19.2.0 | Formularios reactivos |
| @supabase/supabase-js | latest | SDK para comunicación directa con Supabase (PostgreSQL) |
| TailwindCSS | ^4.1.6 | Framework de utilidades CSS |
| DaisyUI | ^5.0.35 | Componentes UI (carousel, navbar, dropdown, buttons) |
| RxJS | ~7.8.0 | Programación reactiva (Observables) |
| zone.js | ~0.15.0 | Zone tracking para Angular |

### Dependencias de desarrollo

| Tecnología | Versión | Propósito |
|---|---|---|
| Angular CLI | ^19.2.8 | Herramientas de desarrollo |
| TypeScript | ~5.7.2 | Lenguaje de programación |
| Jasmine | ~5.6.0 | Framework de testing |
| Karma | ~6.4.0 | Test runner |
| Sharp | ^0.34.1 | Procesamiento de imágenes |

### Scripts npm

| Comando | Acción |
|---|---|
| `npm start` / `ng serve` | Servidor de desarrollo |
| `npm run build` / `ng build` | Build de producción |
| `npm run watch` | Build en modo watch (desarrollo) |
| `npm test` / `ng test` | Ejecutar tests |

---

## 8. Patrones Arquitectónicos Utilizados

| Patrón | Implementación |
|---|---|
| **Standalone Components** | No hay `app.module.ts`; el bootstrap se hace vía `bootstrapApplication()` en `main.ts` |
| **Lazy Loading** | Todas las rutas usan `loadComponent()` para carga bajo demanda de cada página |
| **ChangeDetection OnPush** | Todos los componentes usan `ChangeDetectionStrategy.OnPush` para minimizar ciclos de detección |
| **Layout Pattern** | `MenuNavbarPag1` actúa como shell/layout con navbar fijo + `<router-outlet/>` para las rutas hijas |
| **Service Layer** | `ContactService` encapsula la comunicación con Supabase, inyectado globalmente con `providedIn: 'root'` |
| **Reactive Forms** | El formulario de contacto usa `FormBuilder` con `Validators.required` y `Validators.email` |
| **Component Composition** | `FooterPagesComponent` se reutiliza en las 3 páginas principales mediante su selector `<footer-pages>` |

---

## 9. Observaciones y Posibles Issues

### 9.1 Nomenclatura inconsistente

Los nombres de carpetas y archivos de componentes no coinciden con su función real:

| Carpeta | Archivo | Clase | Función real |
|---|---|---|---|
| `AboutMePag1/` | `HomePag2.component.ts` | `HomePag2Component` | Página Home/About Me |
| `ProyectsPag2/` | `aboutMePag3.component.ts` | `AboutMePag3Component` | Página de Proyectos |
| `ContactamePag3/` | `projetcsPag4.component.ts` | `ProjetcsPag4Component` | Página de Contacto |

> **Recomendación**: Renombrar para que carpetas, archivos y clases reflejen su función (ej: `home/`, `projects/`, `contact/`).

### 9.2 Bug potencial de navegación

En `AboutMePag3Component`, el método `navigateToContact()` usa la ruta `['/contactPag3']`, pero la ruta correcta es `/menuNavbar/contactPag3`. Esto provocaría que el botón no funcione.

### 9.3 Anon Key de Supabase pendiente de configurar

El archivo `src/app/environments/environment.ts` contiene un placeholder `'TU_ANON_KEY_AQUI'` que debe ser reemplazado con la anon key real del proyecto Supabase.

> **Cómo obtenerla**: Dashboard de Supabase → Settings → API → Project API keys → `anon` `public`.

### 9.4 Test spec desactualizado

`app.component.spec.ts` espera encontrar un `<h1>` con texto *"Hello, Portafolio-CJVM"*, pero el template real solo contiene `<router-outlet/>`. Este test fallará.

### 9.5 Assets posiblemente faltantes

Los templates referencian múltiples imágenes (PNG/JPEG como `PP-IMG1.png`, `gifs.png`, `paises.png`, etc.) que no están presentes en la carpeta `public/` (solo hay 4 SVGs). Puede que estén en otra ubicación o falten del repositorio.

### 9.6 Dependencias no utilizadas

`@emailjs/browser` y `@angular/common/http` (`provideHttpClient`) están configuradas en el proyecto pero ya no se utilizan. El formulario de contacto ahora usa `@supabase/supabase-js` directamente.

> **Recomendación**: Eliminar `@emailjs/browser` de `package.json` y `provideHttpClient()` de `app.config.ts` si no se planea usar HttpClient en otro lugar.

### 9.7 Footer usa `href` en vez de `routerLink`

Los enlaces de navegación en `footerPages.component.html` usan `<a href="...">` en lugar de `routerLink`, lo cual causa un **full page reload** (recarga completa) en vez de navegación SPA.

> **Recomendación**: Cambiar a `routerLink` e importar `RouterLink` en `FooterPagesComponent`.

---

## 10. Configuración de Supabase

### Proyecto Supabase

| Propiedad | Valor |
|---|---|
| Nombre del proyecto | `portafolioBackend` |
| URL | `https://pctqjenpqryrbywiqenf.supabase.co` |
| Región | East US (North Virginia) — `us-east-1` |
| Plan | Free (Nano) |

### Pasos para completar la configuración

1. Ir al dashboard de Supabase → **Settings → API**
2. Copiar la **anon public key**
3. Pegarla en `src/app/environments/environment.ts` y `environment.prod.ts` en el campo `anonKey`
4. Asegurarse de que la tabla `contact_messages` exista (ver SQL de creación abajo)
5. Configurar **Row Level Security (RLS)** para permitir inserts desde el frontend

### SQL de la tabla `contact_messages`

```sql
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  public_id  text not null unique default ('MSG-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  full_name  text not null,
  email      text not null,
  company    text,
  phone      text,
  subject    text not null,
  message    text not null,
  status     text not null default 'new'
             check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_email on public.contact_messages (email);
create index if not exists idx_contact_messages_status on public.contact_messages (status);
create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc);

create trigger trg_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();
```

### RLS (Row Level Security) — Política recomendada

Para que el frontend (con `anon key`) pueda insertar mensajes pero no leer/modificar/borrar:

```sql
alter table public.contact_messages enable row level security;

create policy "Allow anonymous inserts"
  on public.contact_messages
  for insert
  to anon
  with check (true);
```
