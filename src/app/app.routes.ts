import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat').then((m) => m.ChatComponent),
  },
  {
    path: 'past-doubts',
    loadComponent: () =>
      import('./features/past-doubts/past-doubts').then((m) => m.PastDoubtsComponent),
  },
];
 