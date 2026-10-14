import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCarouselComponent } from './project-carousel.component';
import { scrollBehavior } from '../../shared/motion';
import { TechIconComponent } from '../../shared/tech-icon.component';
import { PROJECTS } from '../../data/projects.data';

/** Página "Mis Proyectos": se genera completa a partir de data/projects.data.ts. */
@Component({
  selector: 'app-projects',
  imports: [RouterLink, ProjectCarouselComponent, TechIconComponent],
  templateUrl: './projects.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsComponent {
  readonly projects = PROJECTS;

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }
}
