import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, inject, input, signal, viewChild } from '@angular/core';
import { ProjectImage } from '../../data/models';
import { scrollBehavior } from '../../shared/motion';

/**
 * Carrusel de capturas: se mueve arrastrando con el mouse, deslizando en pantallas táctiles,
 * con las flechas, con los puntos o con el teclado. Clic en una imagen la abre ampliada.
 * La rueda del mouse sigue haciendo scroll vertical de la página.
 */
@Component({
  selector: 'app-project-carousel',
  templateUrl: './project-carousel.component.html',
  styleUrl: './project-carousel.component.css',
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCarouselComponent implements OnDestroy {
  readonly images = input.required<ProjectImage[]>();
  readonly label = input('Galería del proyecto');

  private readonly document = inject(DOCUMENT);
  private readonly track = viewChild.required<ElementRef<HTMLDivElement>>('track');

  readonly current = signal(0);
  readonly dragging = signal(false);
  /** Desactiva el scroll-snap mientras se arrastra y hasta que la animación termina, para evitar saltos. */
  readonly freeScroll = signal(false);
  readonly lightboxOpen = signal(false);
  readonly currentImage = computed(() => this.images()[this.current()]);

  private pointerId: number | null = null;
  private dragStartX = 0;
  private dragStartScroll = 0;
  private dragStartIndex = 0;
  private suppressClick = false;
  private settleTimer?: ReturnType<typeof setTimeout>;

  next() {
    this.goTo(this.current() + 1);
  }

  prev() {
    this.goTo(this.current() - 1);
  }

  goTo(index: number) {
    const total = this.images().length;
    const target = (index + total) % total;
    const el = this.track().nativeElement;
    this.current.set(target);
    el.scrollTo({ left: target * el.clientWidth, behavior: scrollBehavior() });
  }

  onScroll() {
    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => {
      if (this.dragging()) return;
      const el = this.track().nativeElement;
      this.current.set(Math.round(el.scrollLeft / el.clientWidth));
      this.freeScroll.set(false);
    }, 120);
  }

  onPointerDown(event: PointerEvent) {
    // En táctil se usa el scroll nativo; el arrastre manual es solo para mouse.
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const el = this.track().nativeElement;
    this.pointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragStartScroll = el.scrollLeft;
    this.dragStartIndex = this.current();
    this.suppressClick = false;
    this.dragging.set(true);
    this.freeScroll.set(true);
    el.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent) {
    if (event.pointerId !== this.pointerId) return;
    const delta = event.clientX - this.dragStartX;
    if (Math.abs(delta) > 5) this.suppressClick = true;
    this.track().nativeElement.scrollLeft = this.dragStartScroll - delta;
  }

  onPointerUp(event: PointerEvent) {
    if (event.pointerId !== this.pointerId) return;
    const el = this.track().nativeElement;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    this.pointerId = null;
    this.dragging.set(false);

    const delta = event.clientX - this.dragStartX;
    const threshold = Math.min(80, el.clientWidth * 0.15);
    const last = this.images().length - 1;
    let target = this.dragStartIndex;
    if (delta <= -threshold) target = Math.min(this.dragStartIndex + 1, last);
    if (delta >= threshold) target = Math.max(this.dragStartIndex - 1, 0);
    this.goTo(target);
    // Si no hubo desplazamiento, no llega ningún evento scroll: se fuerza el cierre del arrastre.
    this.onScroll();
  }

  onTrackClick() {
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }
    this.openLightbox();
  }

  onTrackKeydown(event: KeyboardEvent) {
    // Con la vista ampliada abierta, el teclado lo maneja onDocumentKeydown.
    if (this.lightboxOpen()) return;
    const actions: Record<string, () => void> = {
      ArrowRight: () => this.next(),
      ArrowLeft: () => this.prev(),
      Enter: () => this.openLightbox(),
      ' ': () => this.openLightbox(),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  openLightbox() {
    this.lightboxOpen.set(true);
    this.document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    this.document.body.style.overflow = '';
  }

  /** Teclado global solo mientras la vista ampliada está abierta. */
  onDocumentKeydown(event: KeyboardEvent) {
    if (!this.lightboxOpen()) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }

  ngOnDestroy() {
    clearTimeout(this.settleTimer);
    if (this.lightboxOpen()) this.document.body.style.overflow = '';
  }
}
