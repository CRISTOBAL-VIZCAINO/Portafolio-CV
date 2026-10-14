import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer.component';

/** Estructura común de todas las páginas: navbar, contenido de la ruta y footer. */
@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  host: { class: 'block', '(document:keydown.escape)': 'closeMenuFromKeyboard()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  readonly menuOpen = signal(false);
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  /** Escape: al cerrar se devuelve el foco al botón; si no, se perdería al desaparecer el menú. */
  closeMenuFromKeyboard() {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.menuButton().nativeElement.focus();
  }
}
