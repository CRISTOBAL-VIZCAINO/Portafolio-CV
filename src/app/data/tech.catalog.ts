import { TechGlyph, TechItem } from './models';

// Logos en public/images/technologies/: los de Devicon 2.16.0 (MIT) se copiaron al proyecto para no depender
// de un CDN externo en cada visita. Para añadir uno: descarga <nombre>-original.svg de esa versión con el mismo nombre.
const ICONS = 'images/technologies';
const dev = (name: string) => `${ICONS}/${name}.svg`;

/** Catálogo único de tecnologías: lo usan "Acerca de mí" y "Mis Proyectos" para que siempre coincidan. */
export const TECH = {
  // Lenguajes
  typescript: { label: 'TypeScript', icon: dev('typescript') },
  javascript: { label: 'JavaScript (ES6+)', icon: dev('javascript') },
  python: { label: 'Python', icon: dev('python') },
  php: { label: 'PHP', icon: dev('php') },
  html5: { label: 'HTML5', icon: dev('html5') },
  css3: { label: 'CSS3', icon: dev('css3') },
  sql: { label: 'SQL', glyph: 'database' },

  // Frontend
  angular: { label: 'Angular', icon: dev('angular') },
  rxjs: { label: 'RxJS', icon: dev('rxjs') },
  signals: { label: 'Angular Signals', glyph: 'signal' },
  react: { label: 'React 19', icon: dev('react') },
  nextjs: { label: 'Next.js', icon: dev('nextjs') },
  tailwind: { label: 'Tailwind CSS', icon: dev('tailwindcss') },
  daisyui: { label: 'DaisyUI', glyph: 'layers' },
  bootstrap: { label: 'Bootstrap', icon: dev('bootstrap') },
  storybook: { label: 'Storybook', icon: dev('storybook') },
  responsive: { label: 'Responsive y rendimiento', glyph: 'device' },

  // Backend
  nodejs: { label: 'Node.js', icon: dev('nodejs') },
  express: { label: 'Express', icon: dev('express') },
  nestjs: { label: 'NestJS', icon: dev('nestjs') },
  fastapi: { label: 'FastAPI', icon: dev('fastapi') },
  prisma: { label: 'Prisma', icon: dev('prisma') },
  zod: { label: 'Zod', glyph: 'shield' },
  swagger: { label: 'APIs REST + Swagger', icon: dev('swagger') },
  firebase: { label: 'Firebase', icon: dev('firebase') },
  stripe: { label: 'Stripe', glyph: 'card' },
  giphy: { label: 'API de Giphy', glyph: 'globe' },
  restCountries: { label: 'API REST Countries', glyph: 'globe' },
  localStorage: { label: 'localStorage', glyph: 'database' },

  // Bases de datos
  postgresql: { label: 'PostgreSQL', icon: dev('postgresql') },
  mysql: { label: 'MySQL', icon: dev('mysql') },
  redis: { label: 'Redis', icon: dev('redis') },

  // Cloud y DevOps
  aws: { label: 'AWS', icon: dev('aws') },
  googleCloud: { label: 'Google Cloud', icon: dev('googlecloud') },
  azure: { label: 'Microsoft Azure', icon: dev('azure') },
  docker: { label: 'Docker', icon: dev('docker') },
  kubernetes: { label: 'Kubernetes', icon: dev('kubernetes') },
  argocd: { label: 'ArgoCD', icon: dev('argocd') },
  netlify: { label: 'Netlify', icon: dev('netlify') },

  // Arquitectura y seguridad
  hexagonal: { label: 'Arquitectura hexagonal', glyph: 'layers' },
  monorepo: { label: 'Turborepo + pnpm', icon: dev('pnpm') },
  eventDriven: { label: 'Event-driven', glyph: 'arrows' },
  security: { label: 'JWT · OIDC · RBAC', icon: dev('oauth') },

  // Calidad
  jest: { label: 'Jest', icon: dev('jest') },
  pytest: { label: 'Pytest', icon: dev('pytest') },
  sonarqube: { label: 'SonarQube', icon: dev('sonarqube') },
  sentry: { label: 'Sentry', icon: dev('sentry') },
  eslint: { label: 'ESLint + Prettier', icon: dev('eslint') },

  // Herramientas
  git: { label: 'Git', icon: dev('git') },
  github: { label: 'GitHub', icon: dev('github') },
  bitbucket: { label: 'Bitbucket', icon: dev('bitbucket') },
  jira: { label: 'Jira', icon: dev('jira') },
  postman: { label: 'Postman', icon: dev('postman') },
  figma: { label: 'Figma', icon: dev('figma') },
  lighthouse: { label: 'Lighthouse', glyph: 'chart' },
  ai: { label: 'IA para desarrollo', glyph: 'sparkles' },
  gemini: { label: 'Gemini API + SSE', glyph: 'sparkles' },
} satisfies Record<string, TechItem>;

export type TechKey = keyof typeof TECH;

/** Devuelve la tecnología del catálogo, opcionalmente con una etiqueta más específica (ej. "Angular 18"). */
export function tech(key: TechKey, label?: string): TechItem {
  return label ? { ...TECH[key], label } : TECH[key];
}

/** Íconos genéricos (Heroicons outline) para tecnologías sin logo oficial en Devicon. */
export const GLYPH_PATHS: Record<TechGlyph, string> = {
  arrows: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  card: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  database: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  device: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
  globe: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
  layers: 'M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  signal: 'M9.348 14.651a3.75 3.75 0 010-5.303m5.304-.001a3.75 3.75 0 010 5.304m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
};
