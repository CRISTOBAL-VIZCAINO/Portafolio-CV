import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu-navbar-pag1',
  imports: [ RouterLink, RouterOutlet],
  templateUrl: './MenuNavbarPag1.component.html',
  styleUrl: './MenuNavbarPag1.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MenuNavbarPag1Component { }
