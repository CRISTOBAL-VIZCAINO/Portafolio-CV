import { SkillCategory } from './models';
import { tech } from './tech.catalog';

// Cada tecnología usada en PROJECTS debe aparecer aquí (directa o dentro de la descripción de una tarjeta).
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Lenguajes',
    description: 'La base con la que construyo frontend y backend.',
    skills: [
      { tech: tech('typescript'), detail: 'Mi lenguaje principal en Angular, React, NestJS y Node.js: tipado estricto, genéricos y contratos compartidos.' },
      { tech: tech('javascript'), detail: 'Async/await, módulos, destructuring, localStorage y patrones de diseño para código limpio y mantenible.' },
      { tech: tech('python'), detail: 'APIs con FastAPI y Flask, scripts de automatización y migración de servicios a Node.js.' },
      { tech: tech('php'), detail: 'Desarrollo backend y mantenimiento de aplicaciones web con PHP.' },
      { tech: tech('html5'), detail: 'Maquetación semántica y accesible, con buenas prácticas de SEO y rendimiento.' },
      { tech: tech('css3'), detail: 'Flexbox, Grid, variables CSS y animaciones para interfaces responsive.' },
      { tech: tech('sql'), detail: 'Modelado, consultas e índices en PostgreSQL y MySQL para procesos batch y reportes.' },
    ],
  },
  {
    title: 'Frontend',
    description: 'Interfaces rápidas, responsive y fáciles de usar.',
    skills: [
      { tech: tech('angular', 'Angular 10–20'), detail: 'Migraciones de versión, Signals, SSR con Angular Universal, lazy loading y arquitecturas modulares.' },
      { tech: tech('rxjs'), detail: 'Estado reactivo con Observables y BehaviorSubject para sincronizar vistas y evitar llamadas repetidas.' },
      { tech: tech('react'), detail: 'Portales empresariales con React 19 + Vite, hooks modernos, React Hook Form y TanStack Query.' },
      { tech: tech('nextjs'), detail: 'Portal de comercios y Backoffice de Reconciliación 2.0 construidos con Next.js.' },
      { tech: tech('tailwind', 'Tailwind CSS + DaisyUI'), detail: 'Mi stack de estilos en casi todos mis proyectos, incluido este portafolio.' },
      { tech: tech('bootstrap', 'Bootstrap + Material'), detail: 'Maquetación responsive con Bootstrap y componentes Material Design.' },
      { tech: tech('storybook'), detail: 'Design system documentado como librería de componentes Angular en Puro Pollo.' },
      { tech: tech('responsive'), detail: 'Diseño mobile-first, lazy loading, optimización de assets y Core Web Vitals medidos con Lighthouse.' },
    ],
  },
  {
    title: 'Backend',
    description: 'APIs y servicios confiables para datos y dinero real.',
    skills: [
      { tech: tech('nodejs', 'Node.js + Express'), detail: 'APIs REST, servicios contables y procesamiento masivo de archivos con streams.' },
      { tech: tech('nestjs'), detail: 'API de Reconciliación 2.0: módulos, inyección de dependencias, guards de permisos y colas de trabajo.' },
      { tech: tech('fastapi'), detail: 'APIs REST escalables con validación en Pydantic y pruebas con Pytest.' },
      { tech: tech('prisma', 'Prisma + Zod'), detail: 'ORM tipado sobre PostgreSQL con migraciones e inserciones por lotes, y validación de contratos con Zod.' },
      { tech: tech('swagger'), detail: 'Diseño de APIs documentadas con Swagger/OpenAPI e integración de APIs externas como Giphy y REST Countries.' },
      { tech: tech('firebase'), detail: 'Autenticación, base de datos e inventario en tiempo real para el e-commerce Teslo Shop.' },
      { tech: tech('stripe'), detail: 'Pagos en línea seguros en el checkout de Teslo Shop.' },
    ],
  },
  {
    title: 'Bases de datos',
    description: 'Modelos consistentes y consultas rápidas.',
    skills: [
      { tech: tech('postgresql'), detail: 'Row-Level Security multitenant, consistencia ACID y locks pesimistas para transacciones financieras.' },
      { tech: tech('mysql'), detail: 'Consultas para procesos batch, dashboards y lectura en vivo desde los cores de Kashio.' },
      { tech: tech('redis', 'Redis + BullMQ'), detail: 'Caché distribuida con TTL e invalidación selectiva, y colas de trabajo con BullMQ.' },
    ],
  },
  {
    title: 'Cloud y DevOps',
    description: 'Del código a producción, de forma segura y repetible.',
    skills: [
      { tech: tech('aws'), detail: 'S3 con presigned URLs, SQS con DLQ y Lambda para procesar archivos masivos sin timeouts.' },
      { tech: tech('googleCloud'), detail: 'Cloud Run, Cloud Functions, Cloud Storage y Secret Manager para servicios serverless.' },
      { tech: tech('azure', 'Microsoft Azure / Entra ID'), detail: 'Login corporativo con Microsoft Entra ID (Azure AD) y MSAL, con SSO por organización.' },
      { tech: tech('docker', 'Docker + Kubernetes'), detail: 'Servicios en contenedores para desarrollo y producción, orquestados en Kubernetes.' },
      { tech: tech('argocd'), detail: 'Despliegues GitOps y monitoreo de servicios en Kubernetes.' },
      { tech: tech('netlify'), detail: 'Despliegue continuo de aplicaciones Angular, incluido este portafolio.' },
    ],
  },
  {
    title: 'Arquitectura y seguridad',
    description: 'Sistemas que escalan y protegen la información.',
    skills: [
      { tech: tech('hexagonal'), detail: 'Dominio desacoplado del framework mediante puertos y adaptadores.' },
      { tech: tech('monorepo'), detail: 'Monorepos con varias apps y paquetes compartidos, con builds y tests en caché.' },
      { tech: tech('eventDriven'), detail: 'Workers paralelos con colas y reintentos para procesar archivos de alto volumen.' },
      { tech: tech('security', 'Autenticación y seguridad'), detail: 'JWT, OIDC + PKCE, RBAC por permisos y buenas prácticas OWASP.' },
    ],
  },
  {
    title: 'Calidad y testing',
    description: 'Código confiable y errores bajo control.',
    skills: [
      { tech: tech('jest'), detail: 'Pruebas unitarias y de integración con mocks, con +90% de cobertura.' },
      { tech: tech('pytest'), detail: 'Pruebas de servicios Python y APIs con FastAPI.' },
      { tech: tech('sonarqube'), detail: 'Análisis estático de código y control de deuda técnica.' },
      { tech: tech('sentry'), detail: 'Observabilidad y seguimiento de errores en producción.' },
      { tech: tech('eslint'), detail: 'ESLint, Prettier y Husky para mantener el mismo estándar de código en el equipo.' },
    ],
  },
  {
    title: 'Herramientas e IA',
    description: 'Trabajo en equipo, diseño y productividad.',
    skills: [
      { tech: tech('git', 'Git + GitHub'), detail: 'Ramas, Pull Requests, merge/rebase, resolución de conflictos y code review.' },
      { tech: tech('bitbucket', 'Bitbucket + Jira'), detail: 'Repositorios privados, pipelines YAML y gestión ágil de tareas.' },
      { tech: tech('postman'), detail: 'Colecciones compartidas para probar y documentar endpoints.' },
      { tech: tech('figma'), detail: 'Maquetación pixel-perfect a partir de prototipos de diseño.' },
      { tech: tech('ai'), detail: 'Cursor, Claude Code, GitHub Copilot, ChatGPT, Gemini API y NotebookLM para refactor, testing y prompt engineering.' },
    ],
  },
];
