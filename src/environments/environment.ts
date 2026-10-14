// Configuración pública del frontend. La clave `anon` de Supabase está pensada para ir en el navegador:
// la seguridad la da RLS en la tabla. Nunca pongas aquí la clave `service_role`.
export const environment = {
  supabase: {
    url: 'https://pctqjenpqryrbywiqenf.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdHFqZW5wcXJ5cmJ5d2lxZW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTEzNTYsImV4cCI6MjA4OTc4NzM1Nn0.hVVujnAU7kelmCHbXhkwRUXzgU3-pI2i_C9BTEypofk',
  },
};
