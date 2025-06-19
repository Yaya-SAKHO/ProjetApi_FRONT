import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthStorageService } from '../../services/storage/auth-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authStorage: AuthStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isPublicRequest(request)) {
      return next.handle(request);
    }

    return of(this.authStorage.getAuthData()).pipe(
      switchMap(authData => {
        if (authData?.token) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${authData.token}` }
          });
        }
        return next.handle(request);
      })
    );
  }

  private isPublicRequest(request: HttpRequest<any>): boolean {
    const publicRoutes = ['/auth/login', '/auth/register'];
    return publicRoutes.some(route => request.url.includes(route));
  }
}