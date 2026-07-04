import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  user$: Observable<User | null> = this.currentUser.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Listen for auth state changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.next(session?.user ?? null);
    });

    // Get initial session
    this.supabase.auth.getSession().then(({ data }) => {
      this.currentUser.next(data.session?.user ?? null);
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get currentUserValue(): User | null {
    return this.currentUser.value;
  }

  async signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async getSession() {
    return this.supabase.auth.getSession();
  }
}
