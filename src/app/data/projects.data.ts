import { Project, ProjectImage } from './models';
import { tech } from './tech.catalog';

/** Las capturas viven en public/images/projects/<proyecto>/, numeradas en el orden del carrusel. */
const PROJECT_IMAGES = 'images/projects';

const images = (prefix: string, items: [file: string, caption: string][]): ProjectImage[] =>
  items.map(([file, caption]) => ({ src: `${PROJECT_IMAGES}/${file}`, caption, alt: `${prefix} - ${caption}` }));

export const PROJECTS: Project[] = [
  {
    id: 'kashio',
    kind: 'Experiencia actual',
    organization: 'Kashio Inc',
    period: 'Jul 2025 – Presente',
    role: 'Fullstack Developer · Remoto',
    title: 'Kashio Inc',
    tagline: 'FinTech de pagos y recaudación en LATAM: APIs financieras, cloud e IA',
    summary:
      'APIs financieras integradas con Oracle y SAP, motor contable con consistencia ACID, arquitecturas event-driven en AWS y un chat interno con IA.',
    context:
      'Kashio es una fintech de pagos y recaudación que opera en varios países de LATAM. Trabajo en el área financiera construyendo los servicios que mueven, registran y concilian el dinero de la compañía.',
    stats: [
      { value: '~70%', label: 'Menos tiempo por tarea usando Cursor' },
      { value: '+90%', label: 'Cobertura de pruebas con Jest y Pytest' },
      { value: '100K+', label: 'Registros procesados por archivo' },
      { value: 'ACID', label: 'Motor contable con consistencia transaccional' },
    ],
    highlights: [
      {
        title: 'Integración contable con ERPs',
        text: 'APIs y servicios que se integran con Oracle y SAP, con partida doble, idempotencia y trazabilidad entre Pay-in/Payout y el general ledger.',
      },
      {
        title: 'Motor contable propio',
        text: 'Node.js + Express + PostgreSQL para transacciones de alto volumen, con consistencia ACID, locks pesimistas sobre saldos y reconciliación automática.',
      },
      {
        title: 'Procesamiento masivo de archivos',
        text: 'Arquitecturas event-driven con AWS SQS y Lambda: workers paralelos y concurrencia adaptativa para archivos de cientos de miles de registros, sin timeouts.',
      },
      {
        title: 'Chat interno con IA',
        text: 'Gemini API con respuestas en streaming (SSE), historial de conversación y prompts dinámicos, credenciales en Secret Manager y rate limiting por usuario.',
      },
      {
        title: 'Portales empresariales',
        text: 'React 19 + Vite + Tailwind CSS con login corporativo de Microsoft Azure AD (MSAL) y APIs en Express sobre PostgreSQL.',
      },
      {
        title: 'Rendimiento, seguridad y calidad',
        text: 'Caché distribuida con Redis, APIs protegidas con JWT, roles y lineamientos OWASP, y SonarQube y Sentry para la calidad y el monitoreo en producción.',
      },
    ],
    images: [],
    techs: [
      tech('nodejs'),
      tech('typescript'),
      tech('express'),
      tech('fastapi'),
      tech('python'),
      tech('react'),
      tech('angular', 'Angular 16–19'),
      tech('tailwind'),
      tech('postgresql'),
      tech('mysql'),
      tech('redis'),
      tech('aws', 'AWS (S3, SQS, Lambda)'),
      tech('googleCloud'),
      tech('azure', 'Azure AD (MSAL)'),
      tech('docker'),
      tech('kubernetes'),
      tech('argocd'),
      tech('gemini'),
      tech('security', 'JWT · OWASP'),
      tech('sentry'),
      tech('sonarqube'),
      tech('jest'),
      tech('bitbucket'),
      tech('jira'),
    ],
  },
  {
    id: 'reconciliacion',
    kind: 'Proyecto destacado',
    organization: 'Kashio Inc',
    period: '2026',
    role: 'Diseño y desarrollo de punta a punta',
    title: 'Reconciliación 2.0',
    tagline: 'Plataforma multitenant que concilia los extractos bancarios contra las transacciones de Kashio',
    summary:
      'Plataforma multitenant que automatiza la conciliación bancaria, con login de Microsoft Entra ID, NestJS, Next.js y AWS.',
    context:
      'Cada día, Kashio debe comprobar que lo que reporta el banco coincide con lo que registró la plataforma. Ese proceso era manual, lento y sin trazabilidad. Diseñé y construí la plataforma que lo automatiza para comercios PaaS y PSP en LATAM: carga del extracto, cruce, clasificación de discrepancias y resolución auditada.',
    highlights: [
      {
        title: 'Login corporativo',
        text: 'Acceso al Backoffice con Microsoft Entra ID (MSAL) y OIDC + PKCE por comercio; la API emite su propio JWT con permisos por rol (RBAC).',
      },
      {
        title: 'Motor de conciliación',
        text: 'Cruce 1:1 por columnas configurables que clasifica discrepancias (PSD, DSN, diferencia de monto y duplicados) y permite resolverlas con causa, en lote o con un archivo.',
      },
      {
        title: 'Fuentes de datos flexibles',
        text: 'Parsers versionados en JSON para extractos CSV, TXT y Excel, y lectura del lado B por archivo o en vivo desde los cores de Kashio.',
      },
      {
        title: 'Escala y procesamiento asíncrono',
        text: 'Colas en AWS SQS con DLQ, archivos en S3 vía presigned URLs e inserciones por lotes; preparado para 100K registros por lado.',
      },
      {
        title: 'Aislamiento y auditoría',
        text: 'Row-Level Security en PostgreSQL para separar a cada comercio y un audit log inmutable desde el archivo hasta la resolución.',
      },
      {
        title: 'Arquitectura',
        text: 'Monorepo hexagonal (pnpm + Turborepo): API en NestJS + Prisma y dos frontends en Next.js, el Portal de comercios y el Backoffice VEGA, con contratos compartidos en Zod.',
      },
    ],
    result:
      'Operaciones y los comercios dejan de cuadrar archivos a mano: el sistema cruza los datos, deja para revisión solo las discrepancias y registra cada decisión.',
    cover: `${PROJECT_IMAGES}/reconciliacion/02.webp`,
    images: images('Reconciliación 2.0', [
      ['reconciliacion/01.webp', 'Login corporativo con Microsoft Entra ID (MSAL)'],
      ['reconciliacion/02.webp', 'Monitoreo de runs: KPIs y estado de los procesos de todos los comercios'],
      ['reconciliacion/03.webp', 'Gestión de comercios (multitenant)'],
      ['reconciliacion/04.webp', 'Alta de un nuevo comercio PaaS o PSP'],
      ['reconciliacion/05.webp', 'Configuraciones de lectura del extracto bancario (lado A)'],
      ['reconciliacion/06.webp', 'Nuevo parser · paso 1: ámbito, banco y moneda'],
      ['reconciliacion/07.webp', 'Nuevo parser · paso 2: estructura del archivo en JSON'],
      ['reconciliacion/08.webp', 'Parser versionado y verificado con un archivo real'],
      ['reconciliacion/09.webp', 'Layouts del archivo de Kashio (lado B)'],
      ['reconciliacion/10.webp', 'Nuevo layout de archivo para el lado B'],
      ['reconciliacion/11.webp', 'Layout activo y verificado'],
      ['reconciliacion/12.webp', 'Gestión de procesos de reconciliación por comercio'],
      ['reconciliacion/13.webp', 'Nueva reconciliación: dos archivos o consulta en vivo a Kashio'],
      ['reconciliacion/14.webp', 'Consulta en vivo del lado B contra el core de Kashio'],
      ['reconciliacion/15.webp', 'Carga de archivos con validación de formato'],
      ['reconciliacion/16.webp', 'Proceso listo para validar discrepancias'],
      ['reconciliacion/17.webp', 'Avance del proceso y resultado del cruce'],
      ['reconciliacion/18.webp', 'Resolución de discrepancias PSD / DSN con remediación por archivo'],
    ]),
    techs: [
      tech('nestjs'),
      tech('nextjs'),
      tech('react', 'React'),
      tech('typescript'),
      tech('prisma'),
      tech('postgresql', 'PostgreSQL + RLS'),
      tech('aws', 'AWS (S3, SQS)'),
      tech('redis', 'Redis / BullMQ'),
      tech('azure', 'Entra ID (MSAL)'),
      tech('security', 'OIDC + PKCE · RBAC'),
      tech('tailwind'),
      tech('zod'),
      tech('monorepo'),
      tech('hexagonal'),
      tech('docker'),
    ],
  },
  {
    id: 'puropollo',
    kind: 'Experiencia laboral',
    organization: 'Puro Pollo S.A.S',
    period: 'Feb 2023 – May 2025',
    role: 'Frontend Architect / Desarrollador Web · Híbrido',
    title: 'Sitio web de Puro Pollo',
    tagline: 'Migración del sitio corporativo a Angular 18 con diseño responsive y SEO técnico',
    summary:
      'Migración del sitio corporativo a Angular 18 con diseño responsive, SEO técnico y un design system en Storybook.',
    context:
      'Puro Pollo es una empresa avícola colombiana. Su sitio público (compañía, catálogo de productos, recetas, puntos de venta y contacto) necesitaba verse bien en celulares, cargar más rápido y posicionarse mejor en buscadores.',
    highlights: [
      {
        title: 'Migración a Angular 18',
        text: 'Participé en la migración del sitio con arquitectura modular, lazy loading de rutas, componentes reutilizables y formularios reactivos.',
      },
      {
        title: 'Responsive y rendimiento',
        text: 'Maquetación pixel-perfect desde Figma con Tailwind CSS, Bootstrap y DaisyUI, y auditorías con Lighthouse para mejorar LCP, CLS y TTI.',
      },
      {
        title: 'SEO y analítica',
        text: 'SSR con Angular Universal, meta tags dinámicos, JSON-LD, sitemap y Open Graph; eventos de Google Analytics 4 y Tag Manager para marketing.',
      },
      {
        title: 'Design system',
        text: 'Librería de componentes documentada en Storybook y alineada al brand book, para lanzar nuevas landings y campañas más rápido.',
      },
      {
        title: 'Integración con APIs',
        text: 'Servicios REST con HttpClient y RxJS, y mocks en Node.js/Express para probar las pantallas antes de conectar el backend real.',
      },
    ],
    result: 'Un sitio más rápido, fácil de mantener y consistente en celulares, tablets y computadores.',
    cover: `${PROJECT_IMAGES}/puropollo/01.webp`,
    images: images('Puro Pollo', [
      ['puropollo/01.webp', 'Quiénes somos: historia de la compañía'],
      ['puropollo/02.webp', 'Menú de navegación de La Compañía'],
      ['puropollo/03.webp', 'Ficha de producto: pollo entero'],
      ['puropollo/04.webp', 'Menú desplegable de productos'],
      ['puropollo/05.webp', 'Recetas por categoría'],
      ['puropollo/06.webp', 'Puntos de venta por departamento'],
      ['puropollo/07.webp', 'Formulario de contacto y oficinas'],
      ['puropollo/08.webp', 'Políticas de privacidad'],
      ['puropollo/09.webp', 'Recetas de la categoría En salsa'],
      ['puropollo/10.webp', 'Detalle de la receta del mes'],
      ['puropollo/11.webp', 'Receta con ingredientes y preparación'],
      ['puropollo/12.webp', 'Características nutricionales del producto'],
      ['puropollo/13.webp', 'Tabla de presentaciones del producto'],
    ]),
    techs: [
      tech('angular', 'Angular 18'),
      tech('typescript'),
      tech('rxjs'),
      tech('tailwind'),
      tech('bootstrap'),
      tech('daisyui'),
      tech('storybook'),
      tech('nodejs'),
      tech('html5'),
      tech('css3'),
      tech('figma'),
      tech('lighthouse'),
      tech('git'),
      tech('github'),
      tech('postman'),
    ],
  },
  {
    id: 'gif-generator',
    kind: 'Prueba técnica',
    organization: 'Proceso de ingreso a Puro Pollo',
    title: 'GIF Generator',
    tagline: 'Buscador de GIFs con la API de Giphy, historial de búsquedas y memoria de scroll',
    summary: 'Buscador de GIFs con la API de Giphy, historial de búsquedas y memoria de scroll.',
    context:
      'Como prueba técnica para entrar a Puro Pollo construí en Angular una app para buscar y explorar GIFs. El reto era demostrar código limpio, buen rendimiento y una experiencia fluida en listas largas de contenido.',
    highlights: [
      {
        title: 'Búsqueda y tendencias',
        text: 'Consumo de la API de Giphy para mostrar los GIFs en tendencia y los resultados de búsqueda en una grilla responsive.',
      },
      {
        title: 'Historial de búsquedas',
        text: 'Las búsquedas recientes se guardan en localStorage y quedan a un clic en el menú lateral.',
      },
      {
        title: 'Memoria de scroll',
        text: 'Al recargar o volver a la página, el usuario retoma exactamente desde donde estaba.',
      },
      {
        title: 'Arquitectura modular',
        text: 'Componentes reutilizables, servicios inyectables y lazy loading para cargar cada módulo solo cuando se necesita.',
      },
    ],
    result:
      'Resolví conflictos de versiones y dependencias de Angular reconfigurando el entorno, y entregué una app estable e intuitiva.',
    cover: `${PROJECT_IMAGES}/gif-generator/03.webp`,
    images: images('GIF Generator', [
      ['gif-generator/01.webp', 'Búsqueda de GIFs en tiempo real'],
      ['gif-generator/02.webp', 'Resultados con el historial de búsquedas en el menú'],
      ['gif-generator/03.webp', 'Grilla responsive de resultados'],
    ]),
    techs: [
      tech('angular'),
      tech('typescript'),
      tech('giphy'),
      tech('localStorage'),
      tech('tailwind'),
      tech('bootstrap'),
      tech('html5'),
      tech('css3'),
      tech('postman'),
    ],
  },
  {
    id: 'teslo-shop',
    kind: 'Experiencia laboral',
    organization: 'Emprendimiento · equipo de 5 personas',
    title: 'Teslo Shop',
    tagline: 'E-commerce de ropa con carrito, pagos con Stripe y panel de administración',
    summary: 'E-commerce de ropa con carrito, pagos con Stripe, backend en Firebase y panel de administración.',
    context:
      'Junto a un equipo de 5 personas desarrollé la tienda en línea de un emprendimiento de ropa para niños, jóvenes y adultos. La meta era llevar la marca al canal digital con una plataforma sólida y fácil de administrar.',
    highlights: [
      {
        title: 'Catálogo y compra',
        text: 'Catálogo por categoría (hombres, mujeres y niños), detalle de producto con galería, carrito de compras y checkout.',
      },
      {
        title: 'Pagos con Stripe',
        text: 'Integración de Stripe para procesar los pagos en línea de forma segura.',
      },
      {
        title: 'Backend en Firebase',
        text: 'Autenticación de usuarios, productos, inventario en tiempo real y seguimiento de pedidos.',
      },
      {
        title: 'Panel de administración',
        text: 'Gestión de productos, categorías y pedidos desde un dashboard propio.',
      },
      {
        title: 'Rendimiento',
        text: 'Lazy loading, optimización de imágenes y diseño responsive para cualquier dispositivo.',
      },
    ],
    result:
      'Resolví retos de estado global y sincronización de datos en tiempo real para lograr una experiencia de compra fluida.',
    cover: `${PROJECT_IMAGES}/teslo-shop/01.webp`,
    images: images('Teslo Shop', [
      ['teslo-shop/01.webp', 'Vista general de la tienda'],
      ['teslo-shop/02.webp', 'Catálogo de productos para hombre'],
      ['teslo-shop/03.webp', 'Catálogo de productos para mujer'],
      ['teslo-shop/04.webp', 'Catálogo de productos para niños'],
      ['teslo-shop/05.webp', 'Detalle de producto con galería'],
      ['teslo-shop/06.webp', 'Inicio de sesión'],
      ['teslo-shop/07.webp', 'Panel de administración de productos'],
    ]),
    techs: [
      tech('angular'),
      tech('typescript'),
      tech('firebase'),
      tech('stripe'),
      tech('tailwind'),
      tech('nodejs'),
      tech('docker'),
      tech('netlify'),
      tech('html5'),
      tech('css3'),
      tech('postman'),
      tech('git'),
      tech('github'),
    ],
  },
  {
    id: 'buscador-paises',
    kind: 'Proyecto personal',
    organization: 'Angular + API REST Countries',
    title: 'Buscador de Países',
    tagline: 'Consulta de países por capital, nombre o región con datos en tiempo real',
    summary: 'Consulta de países por capital, nombre o región con la API REST Countries, Signals y RxJS.',
    context:
      'Construí esta app para practicar Angular moderno con un caso real: buscar países y ver su información al instante, sin recargar la página.',
    highlights: [
      {
        title: 'Tres formas de búsqueda',
        text: 'Por capital, por país o por región, con datos de la API REST Countries: bandera, capital, población y región.',
      },
      {
        title: 'Detalle de cada país',
        text: 'Vista dedicada con la bandera, el nombre, la población y la subregión.',
      },
      {
        title: 'Estado reactivo',
        text: 'Signals y Observables (RxJS) para manejar búsquedas y resultados sin recargar la página.',
      },
      {
        title: 'Navegación que recuerda',
        text: 'Memoria de scroll y persistencia en localStorage para retomar desde el mismo punto al volver.',
      },
      {
        title: 'Arquitectura',
        text: 'Lazy loading, componentes desacoplados y servicios inyectables que centralizan el acceso a datos.',
      },
    ],
    cover: `${PROJECT_IMAGES}/buscador-paises/06.webp`,
    images: images('Buscador de Países', [
      ['buscador-paises/01.webp', 'Pantalla de inicio'],
      ['buscador-paises/02.webp', 'Búsqueda por capital'],
      ['buscador-paises/03.webp', 'Búsqueda por país'],
      ['buscador-paises/04.webp', 'Búsqueda por región'],
      ['buscador-paises/05.webp', 'Detalle del país'],
      ['buscador-paises/06.webp', 'Listado de resultados con bandera y población'],
    ]),
    techs: [
      tech('angular', 'Angular 19'),
      tech('typescript'),
      tech('signals'),
      tech('rxjs'),
      tech('restCountries'),
      tech('localStorage'),
      tech('tailwind'),
      tech('daisyui'),
      tech('html5'),
      tech('css3'),
    ],
  },
];
