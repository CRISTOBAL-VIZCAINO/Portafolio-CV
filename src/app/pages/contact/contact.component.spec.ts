import { ComponentFixture, TestBed } from '@angular/core/testing';
import ContactComponent from './contact.component';
import { ContactService } from './contact.service';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let component: ContactComponent;
  let sendMessage: jasmine.Spy<ContactService['sendMessage']>;

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    sendMessage = jasmine.createSpy('sendMessage');
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [{ provide: ContactService, useValue: { sendMessage } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('con el formulario vacío muestra los errores y no envía nada', async () => {
    await component.onSubmit();
    fixture.detectChanges();

    expect(sendMessage).not.toHaveBeenCalled();
    expect(text()).toContain('Escribe tu nombre.');
    expect(text()).toContain('Escribe tu correo.');
    expect(text()).toContain('Escribe el asunto.');
    expect(text()).toContain('Escribe tu mensaje.');
  });

  it('envía los datos normalizados y muestra la confirmación', async () => {
    sendMessage.and.resolveTo();
    component.contactForm.setValue({
      full_name: '  Ana Pérez ',
      // Sin espacios: el navegador ya los quita en <input type="email"> y Validators.email los rechaza.
      email: 'Ana@Correo.COM',
      company: '   ',
      phone: '',
      subject: ' Vacante ',
      message: ' Hola ',
    });

    await component.onSubmit();
    fixture.detectChanges();

    expect(sendMessage).toHaveBeenCalledOnceWith({
      full_name: 'Ana Pérez',
      email: 'ana@correo.com',
      company: null,
      phone: null,
      subject: 'Vacante',
      message: 'Hola',
    });
    expect(component.sending()).toBeFalse();
    expect(component.contactForm.getRawValue().full_name).toBe('');
    expect(text()).toContain('Tu mensaje ha sido enviado correctamente');
  });

  it('con errores lleva el foco al primer campo inválido', async () => {
    document.body.appendChild(fixture.nativeElement);
    component.contactForm.controls.full_name.setValue('Ana');

    await component.onSubmit();

    expect(document.activeElement?.id).toBe('email');
    fixture.nativeElement.remove();
  });

  it('no envía dos veces si se pulsa enviar mientras el primer envío sigue en curso', async () => {
    let resolveSend!: () => void;
    sendMessage.and.returnValue(new Promise<void>((resolve) => (resolveSend = resolve)));
    component.contactForm.setValue({ full_name: 'Ana', email: 'ana@correo.com', company: '', phone: '', subject: 'Hola', message: 'Mensaje' });

    const first = component.onSubmit();
    await component.onSubmit();
    resolveSend();
    await first;

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it('rechaza textos más largos que el máximo permitido', () => {
    component.contactForm.controls.message.setValue('x'.repeat(5001));
    expect(component.contactForm.controls.message.hasError('maxlength')).toBeTrue();
    const textarea = (fixture.nativeElement as HTMLElement).querySelector('textarea');
    expect(textarea?.getAttribute('maxlength')).toBe('5000');
  });

  it('si el envío falla muestra el error y conserva lo escrito', async () => {
    sendMessage.and.rejectWith(new Error('red caída'));
    spyOn(console, 'error');
    component.contactForm.setValue({
      full_name: 'Ana',
      email: 'ana@correo.com',
      company: '',
      phone: '',
      subject: 'Hola',
      message: 'Mensaje',
    });

    await component.onSubmit();
    fixture.detectChanges();

    expect(component.sending()).toBeFalse();
    expect(component.contactForm.getRawValue().full_name).toBe('Ana');
    expect(text()).toContain('Ocurrió un error al enviar el mensaje');
  });
});
