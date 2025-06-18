import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';


export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    map(user => {
      if (user?.role !== 'admin') {
        router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    })
  );
};