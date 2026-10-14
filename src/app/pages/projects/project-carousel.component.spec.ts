import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectImage } from '../../data/models';
import { ProjectCarouselComponent } from './project-carousel.component';

describe('ProjectCarouselComponent', () => {
  const images: ProjectImage[] = [1, 2, 3].map((n) => ({ src: `img-${n}.webp`, alt: `Imagen ${n}`, caption: `Captura ${n}` }));
  let fixture: ComponentFixture<ProjectCarouselComponent>;
  let carousel: ProjectCarouselComponent;

  const caption = () => (fixture.nativeElement as HTMLElement).querySelector('[aria-live]')?.textContent ?? '';

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCarouselComponent);
    carousel = fixture.componentInstance;
    fixture.componentRef.setInput('images', images);
    fixture.detectChanges();
  });

  it('avanza y retrocede dando la vuelta en los extremos', () => {
    carousel.prev();
    expect(carousel.current()).toBe(2);
    carousel.next();
    expect(carousel.current()).toBe(0);
  });

  it('los puntos llevan a la imagen elegida y actualizan el texto', () => {
    const dots = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button[aria-label^="Ir a la imagen"]');
    expect(dots.length).toBe(3);

    dots[2].click();
    fixture.detectChanges();

    expect(carousel.current()).toBe(2);
    expect(caption()).toContain('3 / 3');
    expect(caption()).toContain('Captura 3');
  });

  it('la vista ampliada bloquea el scroll de la página y Escape la cierra', () => {
    carousel.openLightbox();
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(carousel.lightboxOpen()).toBeFalse();
    expect(document.body.style.overflow).toBe('');
  });

  it('al destruirse con la vista ampliada abierta devuelve el scroll a la página', () => {
    carousel.openLightbox();
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });
});
