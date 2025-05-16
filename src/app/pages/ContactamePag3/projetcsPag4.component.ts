import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterPagesComponent } from "../../components/footerPages/footerPages.component";

@Component({
  selector: 'app-projetcs-pag4',
  imports: [FooterPagesComponent],
  templateUrl: './projetcsPag4.component.html',
  styleUrl: './projetcsPag4.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjetcsPag4Component { }
