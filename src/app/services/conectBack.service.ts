import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { ContactMessage, ContactMessageInsert } from '../interfaces/requisitos.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private supabase: SupabaseClient;
  private readonly TABLE = 'contact_messages';

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  async sendMessage(payload: ContactMessageInsert): Promise<void> {
    const { error } = await this.supabase
      .from(this.TABLE)
      .insert(payload);

    if (error) throw error;
  }
}
