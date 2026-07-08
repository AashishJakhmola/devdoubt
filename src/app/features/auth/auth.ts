import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class AuthComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  isLogin = signal(true);
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  toggleMode(): void {
    this.isLogin.set(!this.isLogin());
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.reset();
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, password } = this.form.value;

    try {
      if (this.isLogin()) {
        const { error } = await this.supabase.signIn(email as string, password as string);
        if (error) throw error;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/chat';
        this.router.navigateByUrl(returnUrl);
      } else {
        const { error } = await this.supabase.signUp(email as string, password as string);
        if (error) throw error;
        this.successMessage.set(
          'Account created! Check your email to confirm your account, then sign in.',
        );
        this.isLogin.set(true);
        this.form.reset();
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Something went wrong. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.errorMessage.set('');
    const { error } = await this.supabase.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/chat' },
    });
    if (error) {
      this.errorMessage.set('Google sign-in is not available yet. Please use email and password.');
    }
  }
}
