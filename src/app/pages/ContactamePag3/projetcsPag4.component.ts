import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterPagesComponent } from "../../components/footerPages/footerPages.component";

@Component({
  selector: 'app-projetcs-pag4',
  imports: [FooterPagesComponent, ReactiveFormsModule],
  templateUrl: './projetcsPag4.component.html',
  styleUrl: './projetcsPag4.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjetcsPag4Component {
  contactForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    this.submitted = true;
    this.contactForm.reset();
    this.submitted = false;
    alert('¡Gracias! Tu mensaje ha sido enviado.');
  }
}
