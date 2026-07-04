import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabase.getSession();

  if (data.session) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};
