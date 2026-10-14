export type TechGlyph =
  | 'arrows'
  | 'card'
  | 'chart'
  | 'code'
  | 'database'
  | 'device'
  | 'globe'
  | 'layers'
  | 'shield'
  | 'signal'
  | 'sparkles';

/** Tecnología con su logo (Devicon / public) o, si no existe logo, un ícono genérico. */
export interface TechItem {
  label: string;
  icon?: string;
  glyph?: TechGlyph;
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectHighlight {
  title: string;
  text: string;
}

export interface ProjectStat {
  value: string;
  label: string;
}

export interface Project {
  /** Se usa como ancla: /proyectos#id */
  id: string;
  kind: string;
  organization: string;
  period?: string;
  role?: string;
  title: string;
  tagline: string;
  /** Resumen corto para la tarjeta de "Acerca de mí". */
  summary: string;
  context: string;
  highlights: ProjectHighlight[];
  result?: string;
  stats?: ProjectStat[];
  cover?: string;
  images: ProjectImage[];
  techs: TechItem[];
}

export interface Skill {
  tech: TechItem;
  detail: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
}
