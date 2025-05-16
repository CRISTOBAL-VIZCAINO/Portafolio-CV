import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterPagesComponent } from "../../components/footerPages/footerPages.component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-me-pag3',
  templateUrl: './aboutMePag3.component.html',
  styleUrls: ['./aboutMePag3.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterPagesComponent, RouterLink]
})
export default class AboutMePag3Component {
  constructor(private router: Router) { }

  navigateToContact() {
    this.router.navigate(['/contactPag3']);
  }
}
