/**app.routes.ts */
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { 
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user-routing-module').then(m => m.UserRoutingModule)
  },
  {
  path: 'admin',
  loadChildren: () =>
    import('./pages/admin/admin.routes').then(m => m.adminRoutes)
  },
  { path: '**', redirectTo: 'auth/login' }
];