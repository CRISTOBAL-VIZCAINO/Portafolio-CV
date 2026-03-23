export interface ContactMessage {
  id?: string;
  public_id?: string;
  full_name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export type ContactMessageInsert = Pick<
  ContactMessage,
  'full_name' | 'email' | 'subject' | 'message'
> & Partial<Pick<ContactMessage, 'company' | 'phone'>>;
