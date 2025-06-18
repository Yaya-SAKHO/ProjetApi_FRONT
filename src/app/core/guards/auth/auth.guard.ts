import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};