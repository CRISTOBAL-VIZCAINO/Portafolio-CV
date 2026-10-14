import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ContactMessageInsert } from './contact-message';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  const payload: ContactMessageInsert = {
    full_name: 'Ana Pérez',
    email: 'ana@correo.com',
    company: null,
    phone: null,
    subject: 'Vacante',
    message: 'Hola',
  };

  let service: ContactService;
  let fetchSpy: jasmine.Spy<typeof fetch>;

  beforeEach(() => {
    service = TestBed.inject(ContactService);
    fetchSpy = spyOn(window, 'fetch');
  });

  it('inserta el mensaje en contact_messages con la clave anon', async () => {
    fetchSpy.and.resolveTo(new Response(null, { status: 201 }));

    await service.sendMessage(payload);

    const [url, init] = fetchSpy.calls.mostRecent().args as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(url).toBe(`${environment.supabase.url}/rest/v1/contact_messages`);
    expect(init.method).toBe('POST');
    expect(headers['apikey']).toBe(environment.supabase.anonKey);
    expect(headers['Authorization']).toBe(`Bearer ${environment.supabase.anonKey}`);
    expect(JSON.parse(init.body as string)).toEqual(payload);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('lanza un error si Supabase responde con un estado de error', async () => {
    fetchSpy.and.resolveTo(new Response('permission denied', { status: 401 }));

    await expectAsync(service.sendMessage(payload)).toBeRejectedWithError(/HTTP 401/);
  });
});
