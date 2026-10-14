import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from './contact.service';
import { ContactMessageInsert } from './contact-message';

type Feedback = { type: 'success' | 'error'; message: string };

/**
 * Longitudes máximas por campo. Coinciden con la política RLS recomendada en docs/ARQUITECTURA.md §6;
 * en el formulario evitan textos enormes por error, pero la protección real contra abuso está en Supabase.
 */
export const MAX_LENGTH = { full_name: 120, email: 254, company: 120, phone: 40, subject: 200, message: 5000 } as const;

/** Página de contacto: datos de contacto y formulario que guarda el mensaje en Supabase. */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactComponent {
  private readonly contactService = inject(ContactService);
  private readonly document = inject(DOCUMENT);

  readonly maxLength = MAX_LENGTH;
  readonly contactForm = inject(NonNullableFormBuilder).group({
    full_name: ['', [Validators.required, Validators.maxLength(MAX_LENGTH.full_name)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(MAX_LENGTH.email)]],
    company: ['', Validators.maxLength(MAX_LENGTH.company)],
    phone: ['', Validators.maxLength(MAX_LENGTH.phone)],
    subject: ['', [Validators.required, Validators.maxLength(MAX_LENGTH.subject)]],
    message: ['', [Validators.required, Validators.maxLength(MAX_LENGTH.message)]],
  });

  readonly sending = signal(false);
  readonly feedback = signal<Feedback | null>(null);

  /** Campo tocado e inválido: pinta el borde en rojo y muestra el mensaje de error. */
  invalid(field: keyof typeof this.contactForm.controls): boolean {
    const control = this.contactForm.controls[field];
    return control.touched && control.invalid;
  }

  async onSubmit() {
    // Evita un segundo envío mientras el primero sigue en curso (doble clic, Enter repetido).
    if (this.sending()) return;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.focusFirstInvalidField();
      return;
    }

    this.sending.set(true);
    this.feedback.set(null);

    const value = this.contactForm.getRawValue();
    const payload: ContactMessageInsert = {
      full_name: value.full_name.trim(),
      email: value.email.trim().toLowerCase(),
      company: value.company.trim() || null,
      phone: value.phone.trim() || null,
      subject: value.subject.trim(),
      message: value.message.trim(),
    };

    try {
      await this.contactService.sendMessage(payload);
      this.feedback.set({ type: 'success', message: '¡Gracias! Tu mensaje ha sido enviado correctamente.' });
      this.contactForm.reset();
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      this.feedback.set({ type: 'error', message: 'Ocurrió un error al enviar el mensaje. Intenta nuevamente.' });
    } finally {
      this.sending.set(false);
    }
  }

  /** Lleva el foco (y el lector de pantalla) al primer campo con error. Cada control tiene un input con su mismo id. */
  private focusFirstInvalidField() {
    const first = Object.entries(this.contactForm.controls).find(([, control]) => control.invalid)?.[0];
    if (first) this.document.getElementById(first)?.focus();
  }
}
