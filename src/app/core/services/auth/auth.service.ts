import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { AuthStorageService } from '../storage/auth-storage.service';
import { JwtUtils } from '../../utils/token/jwt.utils';
import { User } from '../../models/user/user-profil.model';
import { ApiResponse } from '../../api/ApiResponse';
import { AuthResponse } from '../../models/auth/auth-response.models';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private api: ApiService,
    private authStorage: AuthStorageService
  ) {
    this.initializeCurrentUser();
  }

register(userData: { name: string; email: string; password: string; role?: string }): Observable<ApiResponse<AuthResponse>> {
    const payload = {
      ...userData,
      role: userData.role || 'user'
    };

    return this.api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload, false).pipe(
      tap({
        next: (response) => {
          if (response.Data?.accessToken) {
            this.handleAuthentication(response.Data.accessToken);
          } else {
            throw new Error('No access token received');
          }
        },
        error: (error) => console.error('Registration error:', error)
      })
    );
  }


 login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, false).pipe(
      tap({
        next: (response) => {
          if (response.Data?.accessToken) {
            this.handleAuthentication(response.Data.accessToken);
          } else {
            throw new Error('No access token received');
          }
        },
        error: (error) => console.error('Login error:', error)
      })
    );
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  logout(): void {
    this.authStorage.clearAuthData();
    this.currentUserSubject.next(null);
  }

  private handleAuthentication(token: string): void {
    if (!token) {
      throw new Error('No token received');
    }

    const decoded = JwtUtils.decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const userData: User = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'user'
    };

    this.authStorage.saveAuthData(
      token,
      userData.role,
      [userData.role]
    );

    this.currentUserSubject.next(userData);
  }

  private initializeCurrentUser(): void {
    try {
      const authData = this.authStorage.getAuthData();
      
      if (authData?.token && !JwtUtils.isTokenExpired(authData.token)) {
        const decoded = JwtUtils.decodeToken(authData.token);
        
        if (decoded) {
          this.currentUserSubject.next({
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role || 'user'
          });
        }
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      this.authStorage.clearAuthData();
    }
  }
}