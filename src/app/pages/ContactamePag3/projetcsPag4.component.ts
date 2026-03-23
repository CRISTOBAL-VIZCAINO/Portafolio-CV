import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FooterPagesComponent } from '../../components/footerPages/footerPages.component';
import { ContactService } from '../../services/conectBack.service';
import { ContactMessageInsert } from '../../interfaces/requisitos.interface';
@Component({
  selector: 'app-projetcs-pag4',
  imports: [FooterPagesComponent, ReactiveFormsModule],
  templateUrl: './projetcsPag4.component.html',
  styleUrl: './projetcsPag4.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjetcsPag4Component {
  contactForm: FormGroup;
  sending = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending = true;
    this.feedbackMessage = '';
    this.feedbackType = '';
    this.cdr.markForCheck();

    const payload: ContactMessageInsert = {
      full_name: this.contactForm.value.full_name.trim(),
      email: this.contactForm.value.email.trim().toLowerCase(),
      company: this.contactForm.value.company?.trim() || null,
      phone: this.contactForm.value.phone?.trim() || null,
      subject: this.contactForm.value.subject.trim(),
      message: this.contactForm.value.message.trim()
    };

    try {
      await this.contactService.sendMessage(payload);
      this.feedbackType = 'success';
      this.feedbackMessage = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
      this.contactForm.reset();
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      this.feedbackType = 'error';
      this.feedbackMessage = 'Ocurrió un error al enviar el mensaje. Intenta nuevamente.';
    } finally {
      this.sending = false;
      this.cdr.markForCheck();
    }
  }
}
