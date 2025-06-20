// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthStorageService } from './storage/auth-storage.service';
import { ApiResponse } from '../api/ApiResponse';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient, 
    private authStorage: AuthStorageService
  ) {}

  get<T>(endpoint: string, requireAuth = true, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.createRequest<T>('GET', endpoint, null, requireAuth, params);
  }

  post<T>(endpoint: string, body: any, requireAuth = true): Observable<ApiResponse<T>> {
    return this.createRequest<T>('POST', endpoint, body, requireAuth);
  }

  put<T>(endpoint: string, body: any, requireAuth = true): Observable<ApiResponse<T>> {
    return this.createRequest<T>('PUT', endpoint, body, requireAuth);
  }

  delete<T>(endpoint: string, requireAuth = true): Observable<ApiResponse<T>> {
    return this.createRequest<T>('DELETE', endpoint, null, requireAuth);
  }

  postFormData<T>(endpoint: string, formData: FormData, requireAuth = true): Observable<ApiResponse<T>> {
    return from(this.prepareFormDataHeaders(requireAuth)).pipe(
      switchMap(headers => {
        const url = `${environment.apiUrl}${endpoint}`;
        return this.http.post<T>(url, formData, { headers }).pipe(
          map(response => this.mapSuccessResponse<T>(response)),
          catchError(error => this.handleError<T>(error))
        );
      })
    );
  }

  putFormData<T>(endpoint: string, formData: FormData, requireAuth = true): Observable<ApiResponse<T>> {
    return from(this.prepareFormDataHeaders(requireAuth)).pipe(
      switchMap(headers => {
        const url = `${environment.apiUrl}${endpoint}`;
        return this.http.put<T>(url, formData, { headers }).pipe(
          map(response => this.mapSuccessResponse<T>(response)),
          catchError(error => this.handleError<T>(error))
        );
      })
    );
  }

  private createRequest<T>(
    method: string,
    endpoint: string,
    body: any = null,
    requireAuth: boolean,
    params?: HttpParams
  ): Observable<ApiResponse<T>> {
    return from(this.prepareHeaders(requireAuth)).pipe(
      switchMap(headers => {
        const options = { headers, params };
        const url = `${environment.apiUrl}${endpoint}`;

        switch (method) {
          case 'POST': return this.http.post<T>(url, body, options);
          case 'GET': return this.http.get<T>(url, options);
          case 'PUT': return this.http.put<T>(url, body, options);
          case 'DELETE': return this.http.delete<T>(url, options);
          default: throw new Error(`Méthode ${method} non supportée`);
        }
      }),
      map(response => this.mapSuccessResponse<T>(response)),
      catchError(error => this.handleError<T>(error))
    );
  }

  private async prepareHeaders(requireAuth: boolean): Promise<HttpHeaders> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (requireAuth) {
      const authData = await this.authStorage.getAuthData();
      if (authData?.token) {
        headers = headers.set('Authorization', `Bearer ${authData.token}`);
      }
    }

    return headers;
  }

  private async prepareFormDataHeaders(requireAuth: boolean): Promise<HttpHeaders> {
    let headers = new HttpHeaders();

    if (requireAuth) {
      const authData = await this.authStorage.getAuthData();
      if (authData?.token) {
        headers = headers.set('Authorization', `Bearer ${authData.token}`);
      }
    }

    return headers;
  }

  private mapSuccessResponse<T>(response: any): ApiResponse<T> {
    return new ApiResponse<T>(
      true,
      response.data || response,
      null,
      200
    );
  }

  private handleError<T>(error: any): Observable<ApiResponse<T>> {
    const apiError = {
      code: error.error?.code || 'HTTP_ERROR',
      message: error.error?.message || error.message,
      details: error.error?.details || JSON.stringify(error),
      timeStamp: new Date().toISOString()
    };
    return of(new ApiResponse<T>(false, null, apiError, error.status || 500));
  }
}