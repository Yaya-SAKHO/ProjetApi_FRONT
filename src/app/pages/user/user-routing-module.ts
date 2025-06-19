import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user.component').then(m => m.UserComponent),
    children: [
      {
        path: '',
        redirectTo: 'pc-builder',
        pathMatch: 'full'
      },
      {
        path: 'pc-builder',
        loadComponent: () => import('./pc-builder/pc-builder').then(m => m.PcBuilder)
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
