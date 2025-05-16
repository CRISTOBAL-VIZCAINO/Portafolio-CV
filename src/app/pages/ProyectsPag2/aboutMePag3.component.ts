import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterPagesComponent } from "../../components/footerPages/footerPages.component";

@Component({
  selector: 'app-about-me-pag3',
  templateUrl: './aboutMePag3.component.html',
  styleUrls: ['./aboutMePag3.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FooterPagesComponent]
})
export default class AboutMePag3Component {}
