import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabase.getSession();

  if (data.session) {
    return true;
  }

  // Remember where the user was trying to go (including ?stack=react),
  // so we can send them back there after login.
  router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
  return false;
};
