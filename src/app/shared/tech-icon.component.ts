import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TechItem } from '../data/models';
import { GLYPH_PATHS } from '../data/tech.catalog';

/** Logo de una tecnología sobre un fondo claro, para que los logos oscuros (Next.js, Express, GitHub) se vean en el tema oscuro. */
@Component({
  selector: 'app-tech-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0 items-center justify-center rounded-lg bg-white shadow-sm' },
  template: `
    @if (tech().icon) {
      <img [src]="tech().icon" alt="" loading="lazy" decoding="async" class="h-full w-full object-contain" />
    } @else {
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" class="h-full w-full text-slate-700" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="glyphPath()" />
      </svg>
    }
  `,
})
export class TechIconComponent {
  readonly tech = input.required<TechItem>();
  readonly glyphPath = computed(() => GLYPH_PATHS[this.tech().glyph ?? 'code']);
}
