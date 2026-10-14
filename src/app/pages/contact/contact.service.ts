import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContactMessageInsert } from './contact-message';

/** Sin respuesta en este tiempo, el envío se cancela y el formulario muestra el error en lugar de quedarse "Enviando...". */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Envía el formulario de contacto a la tabla `contact_messages` de Supabase.
 *
 * Usa directamente la API REST (PostgREST) con la clave pública `anon`, igual que hacía
 * `@supabase/supabase-js` para un `insert`, pero sin cargar el SDK (~200 kB) en la página de contacto.
 * La tabla debe tener RLS que solo permita INSERT al rol `anon` (ver docs/ARQUITECTURA.md).
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly endpoint = `${environment.supabase.url}/rest/v1/contact_messages`;

  async sendMessage(payload: ContactMessageInsert): Promise<void> {
    const { anonKey } = environment.supabase;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`No se pudo enviar el mensaje (HTTP ${response.status}): ${await response.text()}`);
    }
  }
}
