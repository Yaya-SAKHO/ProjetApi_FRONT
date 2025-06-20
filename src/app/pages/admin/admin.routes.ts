import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth/auth.guard';
import { adminGuard } from '../../core/guards/admin/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'composants',
        loadComponent: () =>
          import('./composants/composants-list/composants-list').then(m => m.ComposantsList)
      },
      {
        path: 'composants/nouveau',
        loadComponent: () =>
          import('./composants/composants-form/composants-form').then(m => m.ComposantsForm)
      },
      {
        path: 'composants/:id/modifier',
        loadComponent: () =>
          import('./composants/composants-form/composants-form').then(m => m.ComposantsForm)
      },
      {
        path: 'composants/:id',
        loadComponent: () =>
          import('./composants/composant-detail/composant-detail').then(m => m.ComposantDetail)
      },
      {
        path: 'utilisateurs',
        loadComponent: () =>
          import('./utilisateurs/utilisateurs-list/utilisateurs-list').then(m => m.UtilisateursList)
      },
      {
        path: 'utilisateurs/:id',
        loadComponent: () =>
          import('./utilisateurs/utilisateur-detail/utilisateur-detail').then(m => m.UtilisateurDetail)
      },
      {
        path: 'configurations',
        loadComponent: () =>
          import('./configurations/configurations-list/configurations-list').then(m => m.ConfigurationsList)
      },
      {
        path: 'configurations/:id',
        loadComponent: () =>
          import('./configurations/configuration-detail/configuration-detail').then(m => m.ConfigurationDetail)
      },
      {
        path: 'partenaires',
        loadComponent: () =>
          import('./partenaires/partenaires-list/partenaires-list').then(m => m.PartenairesList)
      },
      {
        path: 'partenaires/nouveau',
        loadComponent: () =>
          import('./partenaires/partenaires-form/partenaires-form').then(m => m.PartenairesForm)
      },
      {
        path: 'partenaires/:id',
        loadComponent: () =>
          import('./partenaires/partenaires-detail/partenaires-detail').then(m => m.PartenairesDetail)
      },
      {
        path: 'partenaires/:id/modifier',
        loadComponent: () =>
          import('./partenaires/partenaires-form/partenaires-form').then(m => m.PartenairesForm)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
