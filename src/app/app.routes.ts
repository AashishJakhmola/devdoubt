import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then((m) => m.AuthComponent),
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat').then((m) => m.ChatComponent),
    canActivate: [authGuard],
  },
  {
    path: 'past-doubts',
    loadComponent: () =>
      import('./features/past-doubts/past-doubts').then((m) => m.PastDoubtsComponent),
    canActivate: [authGuard],
  },
];
