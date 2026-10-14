/** Fila que el formulario inserta en la tabla `contact_messages` de Supabase. */
export interface ContactMessageInsert {
  full_name: string;
  email: string;
  /** Opcional: se envía `null` cuando el campo queda vacío. */
  company: string | null;
  /** Opcional: se envía `null` cuando el campo queda vacío. */
  phone: string | null;
  subject: string;
  message: string;
}
