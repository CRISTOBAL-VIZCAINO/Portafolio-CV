import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FooterPagesComponent } from "../../components/footerPages/footerPages.component";

@Component({
  selector: 'home-pag2',
  templateUrl: './HomePag2.component.html',
  styleUrls: ['./HomePag2.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FooterPagesComponent]
})
export default class HomePag2Component {
  @ViewChild('proyectosSection') proyectosSection!: ElementRef;

  constructor(private router: Router) {}

  scrollToProjects() {
    this.proyectosSection.nativeElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  navigateToAboutMe() {
    this.router.navigate(['/menuNavbar/proyectsPag2']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/Cristobal_Vizcaino_CV-F.docx';
    link.download = 'Cristobal_Vizcaino_CV.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
