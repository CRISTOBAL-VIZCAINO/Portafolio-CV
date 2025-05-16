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
      return;
    }

    this.submitted = true;
    const formData = this.contactForm.value;

    this.http.post('http://localhost:3001/api/contact', formData)
      .subscribe({
        next: () => {
          alert('Mensaje enviado exitosamente!');
          this.contactForm.reset();
          this.submitted = false;
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
          this.submitted = false;
        }
      });
  }
}
