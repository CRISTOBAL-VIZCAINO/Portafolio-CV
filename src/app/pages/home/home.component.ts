import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { scrollBehavior } from '../../shared/motion';
import { TechIconComponent } from '../../shared/tech-icon.component';
import { PROJECTS } from '../../data/projects.data';
import { SKILL_CATEGORIES } from '../../data/skills.data';

/** Página de inicio ("Acerca de mí"): presentación, habilidades y vista previa de proyectos. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, TechIconComponent],
  templateUrl: './home.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  readonly skillCategories = SKILL_CATEGORIES;
  readonly projects = PROJECTS;

  scrollIntoView(element: HTMLElement) {
    element.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }
}
