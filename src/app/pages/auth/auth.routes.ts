import { Routes } from '@angular/router';

import { RegisterPage } from './register/register-page';
import { LoginPage } from './login/login.page';

export const authRoutes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage},
];
